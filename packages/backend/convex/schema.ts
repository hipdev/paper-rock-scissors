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
    gameType: v.union(v.literal('best_of_one'), v.literal('best_of_two')),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    playerCount: v.number(), // Número actual de jugadores inscritos
    currentRound: v.optional(v.number()),
    totalRounds: v.optional(v.number())
  }).index('by_status', ['status']),

  tournamentUsers: defineTable({
    tournamentId: v.id('tournaments'),
    userId: v.id('users'),
    score: v.number(),
    eliminated: v.boolean(),
    joinedAt: v.number(),
    seed: v.number()
  })
    .index('by_tournament', ['tournamentId'])
    .index('by_user', ['userId'])
    .index('by_tournament_and_user', ['tournamentId', 'userId'])
    .index('by_tournament_and_seed', ['tournamentId', 'seed']),

  matches: defineTable({
    tournamentId: v.id('tournaments'),
    round: v.number(),
    matchNumber: v.number(),
    player1Id: v.id('users'), // No longer optional
    player2Id: v.id('users'), // No longer optional
    player1Score: v.number(),
    player2Score: v.number(),
    winnerId: v.optional(v.id('users')),
    status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed')),
    isFinal: v.boolean(),
    nextMatchId: v.optional(v.id('matches')),
    currentGameNumber: v.optional(v.number()),
    currentTurn: v.optional(v.union(v.literal('player1'), v.literal('player2')))
  })
    .index('by_tournament_and_round', ['tournamentId', 'round'])
    .index('by_players', ['player1Id', 'player2Id'])
    .index('by_tournament_round_and_number', ['tournamentId', 'round', 'matchNumber']),

  games: defineTable({
    matchId: v.id('matches'),
    player1Move: v.optional(v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))),
    player2Move: v.optional(v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))),
    winnerId: v.optional(v.id('users')), // Changed from players to users
    createdAt: v.number()
  }).index('by_match', ['matchId'])
})

export default schema
