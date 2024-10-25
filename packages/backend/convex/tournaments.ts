import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

import { getAuthUserId } from '@convex-dev/auth/server'
import {
  createNextRoundMatches,
  determineWinner,
  handleMatchCompletion,
  updateMatchScore
} from './lib/utils'
import { Doc, Id } from './_generated/dataModel'

// Crear un nuevo torneo
export const createTournament = mutation({
  args: {
    name: v.string(),
    gameType: v.union(v.literal('best_of_one'), v.literal('best_of_two'))
  },
  handler: async (ctx, args) => {
    const { name, gameType } = args

    const tournamentId = await ctx.db.insert('tournaments', {
      name,
      gameType,
      playerCount: 0,
      status: 'open',
      createdAt: Date.now(),
      currentRound: 0,
      totalRounds: 0
    })

    return tournamentId
  }
})

// Obtener los torneos
export const getTournaments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tournaments').collect()
  }
})

// Obtener un torneo
export const getTournament = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.tournamentId)
  }
})

// Eliminar un torneo
export const deleteTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('User not authenticated')

    const user = await ctx.db.get(userId)

    if (!user?.isAdmin) throw new Error('You do not have permission to delete tournaments')

    const { tournamentId } = args
    await ctx.db.delete(tournamentId)
  }
})

// Unirse a un torneo
export const joinTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('User not authenticated')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    if (tournament.status !== 'open') {
      throw new Error('You cannot join a tournament that has already started or ended')
    }

    // check if user is already in the tournament
    const userTournament = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament_and_user', (q) =>
        q.eq('tournamentId', tournamentId).eq('userId', userId)
      )
      .first()
    if (userTournament) return

    await ctx.db.insert('tournamentUsers', {
      tournamentId,
      userId,
      score: 0,
      eliminated: false,
      joinedAt: Date.now(),
      seed: Math.random() // Asignar un seed aleatorio
    })

    // Actualizar el número de jugadores actuales
    await ctx.db.patch(tournamentId, {
      playerCount: tournament.playerCount + 1
    })
  }
})

// Iniciar el torneo
export const startTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    if (tournament.status !== 'open') {
      throw new Error('The tournament has already started or ended')
    }

    const participants = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    if (participants.length !== tournament.playerCount) {
      throw new Error('The number of participants does not match the required number')
    }

    // El total de participantes debe ser en base 2 (2, 4, 8, 16, etc.)
    if (!Number.isInteger(Math.log2(participants.length))) {
      throw new ConvexError('The number of participants must be a power of 2')
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
        isFinal: participants.length === 2, // Es final si solo hay 2 jugadores
        currentTurn: 'player1', // Inicializamos con el turno del jugador 1
        currentGameNumber: 1
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
    if (!match) throw new Error('Match not found')

    if (match.status === 'completed') {
      throw new Error('This match has already been completed')
    }

    const winnerId = player1Score > player2Score ? match.player1Id : match.player2Id

    await ctx.db.patch(matchId, {
      player1Score,
      player2Score,
      winnerId,
      status: 'completed'
    })

    const tournament = await ctx.db.get(match.tournamentId)
    if (!tournament) throw new Error('Tournament not found')

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

// Obtener detalles del torneo (Esto podría ser para el ranking)
export const getTournamentDetails = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    const participants = await ctx.db
      .query('tournamentUsers')
      .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    const matches = await ctx.db
      .query('matches')
      .withIndex('by_tournament_and_round', (q) => q.eq('tournamentId', tournamentId))
      .collect()

    // Obtener los nombres de los jugadores
    const playerIds = new Set(matches.flatMap((m) => [m.player1Id, m.player2Id]))
    const players = await Promise.all(Array.from(playerIds).map((id) => ctx.db.get(id)))
    const playerMap = Object.fromEntries(players.map((player) => [player?._id, player?.name]))

    // Organizar los partidos por ronda
    const roundMatches = matches.reduce(
      (acc, match) => {
        if (!acc[match.round]) acc[match.round] = []
        acc[match.round].push({
          ...match,
          player1Name: playerMap[match.player1Id],
          player2Name: playerMap[match.player2Id],
          winnerName: match.winnerId ? playerMap[match.winnerId] : null
        })
        return acc
      },
      {} as Record<number, any[]>
    )

    let winner = null
    if (tournament.status === 'completed' && tournament.winnerId) {
      winner = await ctx.db.get(tournament.winnerId)
    }

    return { tournament, participants, roundMatches, winner }
  }
})

// Obtener el match actual para el jugador
export const getCurrentMatch = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('User not authenticated')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    if (tournament.status !== 'in_progress') {
      throw new Error('The tournament is not in progress')
    }

    // Buscar el partido actual del jugador
    const currentMatch = await ctx.db
      .query('matches')
      .withIndex('by_tournament_and_round', (q) =>
        q.eq('tournamentId', tournamentId).eq('round', tournament.currentRound || 0)
      )
      .filter((q) => q.or(q.eq(q.field('player1Id'), userId), q.eq(q.field('player2Id'), userId)))
      .first()

    if (!currentMatch) {
      return null // El jugador no tiene un partido actual en esta ronda
    }

    const lastGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', currentMatch._id))
      .order('desc')
      .first()

    // Obtener los nombres de los jugadores
    const player1 = await ctx.db.get(currentMatch.player1Id)
    const player2 = await ctx.db.get(currentMatch.player2Id)

    return {
      ...currentMatch,
      player1Name: player1?.name || 'Unknown',
      player2Name: player2?.name || 'Unknown',
      isCurrentPlayer: userId === currentMatch.player1Id ? 'player1' : 'player2',
      isYourTurn:
        userId === currentMatch.player1Id
          ? currentMatch.currentTurn === 'player1'
          : currentMatch.currentTurn === 'player2',
      lastGameResult: lastGame?.result, // Incluimos el resultado del último juego
      lastGameWinnerName: lastGame?.result === 'player1' ? player1?.name : player2?.name,
      lastGameMoves: {
        player1Move: lastGame?.player1Move,
        player2Move: lastGame?.player2Move
      }
    }
  }
})

// Registrar el resultado de un juego individual
export const playGame = mutation({
  args: {
    matchId: v.id('matches'),
    move: v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))
  },
  handler: async (ctx, args) => {
    const { matchId, move } = args

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError('User not authenticated')

    const match = await ctx.db.get(matchId)
    if (!match) throw new ConvexError('Match not found')

    if (match.status === 'completed') {
      throw new ConvexError('This match has already been completed')
    }

    const tournament = await ctx.db.get(match.tournamentId)
    if (!tournament) throw new ConvexError('Tournament not found')

    const isPlayer1 = userId === match.player1Id
    if (
      (isPlayer1 && match.currentTurn !== 'player1') ||
      (!isPlayer1 && match.currentTurn !== 'player2')
    ) {
      throw new ConvexError('It is not your turn')
    }

    const updateField = isPlayer1 ? 'player1Move' : 'player2Move'

    // Obtener el juego actual o crear uno nuevo
    const currentGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', matchId))
      .order('desc')
      .first()

    if (!currentGame || (currentGame.player1Move && currentGame.player2Move)) {
      // Crear un nuevo juego
      await ctx.db.insert('games', {
        matchId,
        [updateField]: move,
        createdAt: Date.now()
      })
    } else {
      // Actualizar el juego existente
      await ctx.db.patch(currentGame._id, { [updateField]: move })
    }

    // Obtener el juego actualizado
    const updatedGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', matchId))
      .order('desc')
      .first()

    if (!updatedGame) throw new ConvexError('Game not found')

    // Si ambos jugadores han hecho su movimiento
    if (updatedGame.player1Move && updatedGame.player2Move) {
      const gameWinner = determineWinner(updatedGame.player1Move, updatedGame.player2Move)

      await ctx.db.patch(updatedGame._id, {
        winnerId:
          gameWinner === 'tie' ? undefined : match[`${gameWinner}Id` as 'player1Id' | 'player2Id'],
        result: gameWinner
      })

      if (gameWinner !== 'tie') {
        const updatedMatch = await updateMatchScore(ctx, match, gameWinner)

        if (updatedMatch && updatedMatch.status === 'completed') {
          await handleMatchCompletion(ctx, updatedMatch)
        }
      }

      // Cambiar el turno y actualizar el número de juego
      const nextTurn = match.currentTurn === 'player1' ? 'player2' : 'player1'
      await ctx.db.patch(matchId, {
        currentTurn: nextTurn,
        currentGameNumber: (match.currentGameNumber || 0) + 1
      })

      return gameWinner
    } else {
      // Si solo un jugador ha hecho su movimiento, cambiar el turno
      const nextTurn = match.currentTurn === 'player1' ? 'player2' : 'player1'
      await ctx.db.patch(matchId, { currentTurn: nextTurn })
      return 'waiting'
    }
  }
})

// Obtener el match y el game que el jugador perdió, es decir, el match donde winnerId no es el usuario actual
export const getLostMatch = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('User not authenticated')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    const lostMatch = await ctx.db
      .query('matches')
      .filter((q) => q.neq(q.field('winnerId'), userId))
      .first()

    const lostGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', lostMatch?._id as Id<'matches'>))
      .first()

    const winnerIdData = await ctx.db.get(lostMatch?.winnerId as Id<'users'>)

    return {
      match: lostMatch,
      game: lostGame,
      winnerIdData,
      player1Move: userId === lostMatch?.player1Id ? lostGame?.player1Move : lostGame?.player2Move,
      player2Move: userId === lostMatch?.player2Id ? lostGame?.player1Move : lostGame?.player2Move
    }
  }
})

// Obtener el ganador del torneo
export const getTournamentWinner = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Tournament not found')

    if (tournament.status !== 'completed') {
      throw new Error('The tournament has not yet ended')
    }

    if (!tournament.winnerId) {
      throw new Error('No winner has been registered for this tournament')
    }

    const winner = await ctx.db.get(tournament.winnerId)
    if (!winner) throw new Error('Winner not found')

    return {
      tournamentName: tournament.name,
      winnerName: winner.name,
      winnerId: winner._id
    }
  }
})
