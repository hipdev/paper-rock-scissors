import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

import { getAuthUserId } from '@convex-dev/auth/server'
import {
  createNextRoundMatches,
  determineWinner,
  handleMatchCompletion,
  updateMatchScore
} from './lib/utils'

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
    if (!userId) throw new Error('Usuario no autenticado')

    const user = await ctx.db.get(userId)

    if (!user?.isAdmin) throw new Error('No tienes permisos para eliminar torneos')

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
    if (!userId) throw new Error('Usuario no autenticado')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Torneo no encontrado')

    if (tournament.status !== 'open') {
      throw new Error('No se puede unir a un torneo que ya ha comenzado o terminado')
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

// Obtener detalles del torneo (Esto podría ser para el ranking)
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

// Obtener el match actual para el jugador
export const getCurrentMatch = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const { tournamentId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Usuario no autenticado')

    const tournament = await ctx.db.get(tournamentId)
    if (!tournament) throw new Error('Torneo no encontrado')

    if (tournament.status !== 'in_progress') {
      throw new Error('El torneo no está en progreso')
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
          : currentMatch.currentTurn === 'player2'
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
    if (!userId) throw new Error('Usuario no autenticado')

    const match = await ctx.db.get(matchId)
    if (!match) throw new Error('Partido no encontrado')

    if (match.status === 'completed') {
      throw new Error('Este partido ya ha sido completado')
    }

    const isPlayer1 = userId === match.player1Id
    if (
      (isPlayer1 && match.currentTurn !== 'player1') ||
      (!isPlayer1 && match.currentTurn !== 'player2')
    ) {
      throw new Error('No es tu turno')
    }

    const updateField = isPlayer1 ? 'player1Move' : 'player2Move'
    const otherPlayer = isPlayer1 ? 'player2' : 'player1'

    // Verifica si el juego ya existe para este match

    const existingGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', matchId))
      .first()

    if (existingGame) {
      // Si existe, actualiza el movimiento
      await ctx.db.patch(existingGame._id, {
        [updateField]: move
      })
    } else {
      // Si no existe, crea un nuevo juego
      const game = await ctx.db.insert('games', {
        matchId,
        [updateField]: move,
        createdAt: Date.now()
      })
    }

    // Cambiar el turno
    await ctx.db.patch(matchId, { currentTurn: otherPlayer })

    // Obtener el juego recien creado o actualizado
    const currentGame = await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', matchId))
      .first()

    console.log('currentGame', currentGame)
    if (!currentGame) throw new Error('Partido no encontrado')

    // Si ambos jugadores han hecho su movimiento, determinar el ganador
    if (currentGame.player1Move && currentGame.player2Move) {
      console.log('both moves', currentGame.player1Move, currentGame.player2Move)
      // const gameWinner = determineWinner(currentGame.player1Move, currentGame.player2Move)
      // console.log('game winner', gameWinner)
      // await ctx.db.patch(currentGame._id, {
      //   winnerId: gameWinner === 'tie' ? undefined : match[`${gameWinner}Id`]
      // })
      // if (gameWinner !== 'tie') {
      //   const updatedMatch = await updateMatchScore(ctx, match, gameWinner)
      //   if (updatedMatch.status === 'completed') {
      //     await handleMatchCompletion(ctx, updatedMatch)
      //   }
      // }
      // return gameWinner
    }

    return 'waiting'
  }
})
