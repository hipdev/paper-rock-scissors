import { v } from 'convex/values'
import { DatabaseReader, DatabaseWriter, mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'
import { getAuthUserId } from '@convex-dev/auth/server'

// Crear un nuevo torneo
export const createTournament = mutation({
  args: {
    name: v.string(),
    gameType: v.union(v.literal('best_of_one'), v.literal('best_of_two')),
    playerCount: v.number()
  },
  handler: async (ctx, args) => {
    const { name, gameType, playerCount } = args

    if (playerCount % 2 !== 0 || playerCount < 2) {
      throw new Error('El número de jugadores debe ser par y al menos 2')
    }

    const tournamentId = await ctx.db.insert('tournaments', {
      name,
      gameType,
      playerCount,
      status: 'open',
      createdAt: Date.now(),
      currentRound: 0,
      totalRounds: Math.log2(playerCount)
    })

    return tournamentId
  }
})

// Unirse a un torneo
export const joinTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Usuario no autenticado')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Torneo no encontrado')

    if (tournament.status !== 'open') {
      throw new Error('No se puede unir a un torneo que ya ha comenzado o terminado')
    }

    const participantCount = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    if (participantCount.length >= tournament.playerCount) {
      throw new Error('El torneo está lleno')
    }

    await ctx.db.insert('tournamentUsers', {
      tournamentId,
      userId,
      score: 0,
      eliminated: false,
      joinedAt: Date.now(),
      seed: Math.random() // Asignar un seed aleatorio
    })
  }
})

// Iniciar el torneo
export const startTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Torneo no encontrado')

    if (tournament.status !== 'open') {
      throw new Error('El torneo ya ha comenzado o terminado')
    }

    const participants = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    if (participants.length !== tournament.playerCount) {
      throw new Error('El número de participantes no coincide con el requerido')
    }

    // Ordenar participantes por seed
    participants.sort((a, b) => a.seed - b.seed)

    // Crear partidos de la primera ronda
    for (let i = 0; i < participants.length; i += 2) {
      await ctx.db.insert('matches', {
        tournamentId,
        round: 1,
        matchNumber: i / 2 + 1,
        player1Id: participants[i].userId,
        player2Id: participants[i + 1].userId,
        player1Score: 0,
        player2Score: 0,
        status: 'pending',
        isFinal: participants.length === 2 // Es final si solo hay 2 jugadores
      })
    }

    // Actualizar el estado del torneo
    await ctx.db.patch(tournamentId, {
      status: 'in_progress',
      startedAt: Date.now(),
      currentRound: 1
    })
  }
})

// Registrar el resultado de un partido
export const completeMatch = mutation({
  args: {
    matchId: v.id('matches'),
    player1Score: v.number(),
    player2Score: v.number()
  },
  handler: async (ctx, args) => {
    const { matchId, player1Score, player2Score } = args

    const match = await ctx.db.get(matchId)
    if (!match) throw new Error('Partido no encontrado')

    if (match.status === 'completed') {
      throw new Error('Este partido ya ha sido completado')
    }

    const winnerId = player1Score > player2Score ? match.player1Id : match.player2Id

    await ctx.db.patch(matchId, {
      player1Score,
      player2Score,
      winnerId,
      status: 'completed'
    })

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
          completedAt: Date.now()
        })
      } else {
        // Crear partidos para la siguiente ronda
        await createNextRoundMatches(ctx, match.tournamentId, match.round)
      }
    }
  }
})

// Función auxiliar para crear partidos de la siguiente ronda
async function createNextRoundMatches(
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
      isFinal
    })

    // Actualizar nextMatchId para los partidos completados
    await ctx.db.patch(completedMatches[i]._id, { nextMatchId: newMatchId })
    await ctx.db.patch(completedMatches[i + 1]._id, { nextMatchId: newMatchId })
  }

  // Actualizar el torneo
  await ctx.db.patch(tournamentId, { currentRound: nextRound })
}

// Obtener detalles del torneo
export const getTournamentDetails = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Torneo no encontrado')

    const participants = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    const matches = await ctx.db
      .query('matches')
      .withIndex('by_tournament_and_round', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    return { tournament, participants, matches }
  }
})
