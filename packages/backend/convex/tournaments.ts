import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { ConvexError, v } from 'convex/values'

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

// Get all open tournaments
export const getTournaments = query({
  handler: async (ctx) => {
    return await ctx.db.query('tournaments').collect()
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

    const users = await ctx.db
      .query('tournamentUsers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .collect()

    if (users.length < 2 || users.length % 2 !== 0) {
      throw new Error('Number of users must be even and at least 2 to start the tournament')
    }

    // Shuffle users
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[users[i], users[j]] = [users[j], users[i]]
    }

    // Generate first round matches
    for (let i = 0; i < users.length; i += 2) {
      await ctx.db.insert('matches', {
        tournamentId: args.tournamentId,
        round: 1,
        player1Id: users[i].userId,
        player2Id: users[i + 1].userId,
        player1Score: 0,
        player2Score: 0,
        status: 'pending',
        isFinal: users.length === 2 // If only 2 users, it's the final match
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
    const tournamentUser = await ctx.db
      .query('tournamentUsers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    return tournamentUser ? 'joined' : 'not_joined'
  }
})

// Get the user's current match in a tournament
export const getUserCurrentMatch = query({
  args: { tournamentId: v.id('tournaments'), userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) =>
        q.or(q.eq(q.field('player1Id'), args.userId), q.eq(q.field('player2Id'), args.userId))
      )
      .filter((q) => q.neq(q.field('status'), 'completed'))
      .first()
  }
})

// Join a tournament
export const joinTournament = mutation({
  args: {
    tournamentId: v.id('tournaments')
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('User not found')
    }

    // Check if the user is already in the tournament
    const existingTournamentUser = await ctx.db
      .query('tournamentUsers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first()

    if (existingTournamentUser) {
      throw new ConvexError('User already in tournament')
    }

    await ctx.db.insert('tournamentUsers', {
      tournamentId: args.tournamentId,
      userId: userId,
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

export const getTournamentUser = query({
  args: { tournamentId: v.id('tournaments'), userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('tournamentUsers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()
  }
})

// Get all users for a specific tournament with their full user information
export const getTournamentUsers = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    const tournamentUsers = await ctx.db
      .query('tournamentUsers')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .collect()

    // Perform a "join" to get the full user information
    const usersWithInfo = await Promise.all(
      tournamentUsers.map(async (tournamentUser) => {
        const user = await ctx.db.get(tournamentUser.userId)
        return {
          ...tournamentUser,
          userInfo: user
        }
      })
    )

    return usersWithInfo
  }
})
