import { getAuthUserId } from '@convex-dev/auth/server'
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

// Get a specific tournament by ID
export const getTournament = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.tournamentId)
  }
})

// Get the current user's status in a tournament
export const getUserTournamentStatus = query({
  args: { tournamentId: v.id('tournaments'), userId: v.id('users') },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    if (!player) return 'not_registered'

    const tournamentPlayer = await ctx.db
      .query('tournamentPlayers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) => q.eq(q.field('playerId'), player._id))
      .first()

    return tournamentPlayer ? 'joined' : 'not_joined'
  }
})

// Get the user's current match in a tournament
export const getUserCurrentMatch = query({
  args: { tournamentId: v.id('tournaments'), userId: v.id('users') },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    if (!player) return null

    return await ctx.db
      .query('matches')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) =>
        q.or(q.eq(q.field('player1Id'), player._id), q.eq(q.field('player2Id'), player._id))
      )
      .filter((q) => q.neq(q.field('status'), 'completed'))
      .first()
  }
})

// Join a tournament
export const joinTournament = mutation({
  args: {
    tournamentId: v.id('tournaments'),
    userId: v.id('users')
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    if (!player) {
      throw new Error('Player not found')
    }

    await ctx.db.insert('tournamentPlayers', {
      tournamentId: args.tournamentId,
      playerId: player._id,
      score: 0,
      eliminated: false
    })
  }
})

// Delete a tournament
export const deleteTournament = mutation({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('User not found')
    }

    const isAdmin = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('_id'), userId))
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()

    if (!isAdmin) {
      throw new Error('User is not an admin')
    }
    await ctx.db.delete(args.tournamentId)
  }
})
