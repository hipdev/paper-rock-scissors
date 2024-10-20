import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Create a new tournament
export const createTournament = mutation({
  args: {
    name: v.string(),
    gameType: v.union(v.literal('single_elimination'), v.literal('best_of_two'))
  },
  handler: async (ctx, args) => {
    const tournamentId = await ctx.db.insert('tournaments', {
      name: args.name,
      status: 'open',
      gameType: args.gameType,
      createdAt: Date.now()
    })
    return tournamentId
  }
})

// Get all open tournaments
export const getOpenTournaments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('tournaments')
      .filter((q) => q.eq(q.field('status'), 'open'))
      .collect()
  }
})

// Join a tournament
export const joinTournament = mutation({
  args: {
    tournamentId: v.id('tournaments'),
    playerId: v.id('players')
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tournamentPlayers', {
      tournamentId: args.tournamentId,
      playerId: args.playerId,
      score: 0,
      eliminated: false
    })
  }
})

// Start a tournament
export const startTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const tournament = await ctx.db.get(args.tournamentId)
    if (!tournament || tournament.status !== 'open') {
      throw new Error('Tournament not found or not open')
    }

    const players = await ctx.db
      .query('tournamentPlayers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .collect()

    if (players.length % 2 !== 0) {
      throw new Error('Number of players must be even to start the tournament')
    }

    // Generate first round matches
    for (let i = 0; i < players.length; i += 2) {
      await ctx.db.insert('matches', {
        tournamentId: args.tournamentId,
        round: 1,
        player1Id: players[i].playerId,
        player2Id: players[i + 1].playerId,
        player1Score: 0,
        player2Score: 0,
        status: 'pending',
        isFinal: players.length === 2 // If only 2 players, it's the final match
      })
    }

    // Update tournament status
    await ctx.db.patch(args.tournamentId, {
      status: 'in_progress',
      startedAt: Date.now()
    })
  }
})
