import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'

const schema = defineSchema({
  ...authTables,
  // Users table (updated)
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    isAnonymous: v.optional(v.boolean()),
    isAuthorized: v.optional(v.boolean()),
    isSuperAdmin: v.optional(v.boolean()),
    lastName: v.optional(v.string()),
    name: v.optional(v.string()), // Changed from optional to required
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number())
  })
    .index('email', ['email'])
    .index('isAdmin', ['isAdmin']),

  tournaments: defineTable({
    name: v.string(),
    status: v.union(v.literal('open'), v.literal('in_progress'), v.literal('completed')),
    gameType: v.union(v.literal('single_elimination'), v.literal('best_of_two')),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number())
  }).index('by_status', ['status']),

  tournamentUsers: defineTable({
    tournamentId: v.id('tournaments'),
    userId: v.id('users'), // Changed from playerId to userId
    score: v.number(),
    eliminated: v.boolean()
  }).index('by_tournament', ['tournamentId']),

  matches: defineTable({
    tournamentId: v.id('tournaments'),
    round: v.number(),
    player1Id: v.id('users'), // Changed from players to users
    player2Id: v.id('users'), // Changed from players to users
    player1Score: v.number(),
    player2Score: v.number(),
    winnerId: v.optional(v.id('users')), // Changed from players to users
    status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed')),
    isFinal: v.boolean()
  }).index('by_tournament_and_round', ['tournamentId', 'round']),

  games: defineTable({
    matchId: v.id('matches'),
    player1Move: v.optional(v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))),
    player2Move: v.optional(v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))),
    winnerId: v.optional(v.id('users')) // Changed from players to users
  }).index('by_match', ['matchId'])
})

export default schema
