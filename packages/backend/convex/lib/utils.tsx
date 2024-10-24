import { Doc, Id } from '../_generated/dataModel'
import { DatabaseReader, DatabaseWriter } from '../_generated/server'

// Función auxiliar para crear partidos de la siguiente ronda
export async function createNextRoundMatches(
  ctx: {
    db: DatabaseReader & DatabaseWriter
  },
  tournamentId: Id<'tournaments'>,
  currentRound: number
) {
  const completedMatches = await ctx.db
    .query('matches')
    .withIndex('by_tournament_and_round', (q) =>
      q.eq('tournamentId', tournamentId).eq('round', currentRound)
    )
    .collect()

  const nextRound = currentRound + 1
  const isFinal = completedMatches.length === 2

  for (let i = 0; i < completedMatches.length; i += 2) {
    const newMatchId = await ctx.db.insert('matches', {
      tournamentId,
      round: nextRound,
      matchNumber: i / 2 + 1,
      player1Id: completedMatches[i].winnerId!,
      player2Id: completedMatches[i + 1].winnerId!,
      player1Score: 0,
      player2Score: 0,
      status: 'pending',
      isFinal,
      currentTurn: 'player1', // Establecemos el turno inicial como player1
      currentGameNumber: 1
    })

    // Actualizar nextMatchId para los partidos completados
    await ctx.db.patch(completedMatches[i]._id, { nextMatchId: newMatchId })
    await ctx.db.patch(completedMatches[i + 1]._id, { nextMatchId: newMatchId })
  }

  // Actualizar el torneo
  await ctx.db.patch(tournamentId, { currentRound: nextRound })
}

// Función auxiliar para determinar el ganador de un juego
export function determineWinner(player1Move: string, player2Move: string) {
  if (player1Move === player2Move) return 'tie'
  if (
    (player1Move === 'rock' && player2Move === 'scissors') ||
    (player1Move === 'paper' && player2Move === 'rock') ||
    (player1Move === 'scissors' && player2Move === 'paper')
  ) {
    return 'player1'
  }
  return 'player2'
}

// Función auxiliar para actualizar la puntuación del partido
export async function updateMatchScore(
  ctx: {
    db: DatabaseReader & DatabaseWriter
  },
  match: Doc<'matches'>,
  gameWinner: string
) {
  const player1Score = gameWinner === 'player1' ? match.player1Score + 1 : match.player1Score
  const player2Score = gameWinner === 'player2' ? match.player2Score + 1 : match.player2Score

  const tournament = await ctx.db.get(match.tournamentId)

  console.log('tournament', tournament, player1Score, player2Score)

  const isBestOfTwo = match.isFinal || tournament?.gameType === 'best_of_two'
  const isCompleted = isBestOfTwo
    ? player1Score === 2 ||
      player2Score === 2 ||
      (player1Score === 1 && player2Score === 1 && match.currentGameNumber === 2)
    : Math.max(player1Score, player2Score) === 1

  const winnerId = isCompleted
    ? player1Score > player2Score
      ? match.player1Id
      : player2Score > player1Score
        ? match.player2Id
        : undefined // En caso de empate en la final
    : undefined

  console.log('winnerId', winnerId, isCompleted)

  // update match
  await ctx.db.patch(match._id, {
    player1Score,
    player2Score,
    winnerId,
    status: isCompleted ? 'completed' : 'in_progress',
    currentGameNumber: match.currentGameNumber ? match.currentGameNumber + 1 : 1
  })

  return await ctx.db.get(match._id)
}

// Función auxiliar para manejar la finalización de un partido
export async function handleMatchCompletion(
  ctx: {
    db: DatabaseReader & DatabaseWriter
  },
  match: Doc<'matches'>
) {
  const tournament = await ctx.db.get(match.tournamentId)
  if (!tournament) throw new Error('Torneo no encontrado')

  // Verificar si todos los partidos de la ronda actual están completos
  const allMatchesInRound = await ctx.db
    .query('matches')
    .withIndex('by_tournament_and_round', (q) =>
      q.eq('tournamentId', match.tournamentId).eq('round', match.round)
    )
    .collect()

  const allCompleted = allMatchesInRound.every((m) => m.status === 'completed')

  if (allCompleted) {
    if (match.isFinal) {
      // Finalizar el torneo
      await ctx.db.patch(match.tournamentId, {
        status: 'completed',
        completedAt: Date.now(),
        winnerId: match.winnerId // Establecemos el ganador del torneo
      })
    } else {
      // Crear partidos para la siguiente ronda
      await createNextRoundMatches(ctx, match.tournamentId, match.round)
    }
  }
}
