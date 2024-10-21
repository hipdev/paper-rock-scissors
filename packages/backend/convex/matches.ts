import { Id } from './_generated/dataModel'
import { DatabaseReader, DatabaseWriter, mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get matches for a specific tournament and round
export const getMatches = query({
  args: {
    tournamentId: v.id('tournaments'),
    round: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .withIndex('by_tournament_and_round')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .filter((q) => q.eq(q.field('round'), args.round))
      .collect()
  }
})

export const getMatchesForTournament = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .filter((q) => q.eq(q.field('tournamentId'), args.tournamentId))
      .collect()
  }
})

// Play a game in a match
export const playGame = mutation({
  args: {
    matchId: v.id('matches'),
    userId: v.id('users'),
    move: v.union(v.literal('rock'), v.literal('paper'), v.literal('scissors'))
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId)
    if (!match) {
      throw new Error('Match not found')
    }

    if (match.status === 'completed') {
      throw new Error('Match is already completed')
    }
  }
})

function determineWinner(move1: string, move2: string): number | null {
  if (move1 === move2) return null
  if (
    (move1 === 'rock' && move2 === 'scissors') ||
    (move1 === 'paper' && move2 === 'rock') ||
    (move1 === 'scissors' && move2 === 'paper')
  ) {
    return 1
  }
  return 2
}

async function advanceTournament(
  ctx: {
    db: DatabaseReader & DatabaseWriter
  },
  tournamentId: Id<'tournaments'>,
  currentRound: number
) {
  const matches = await ctx.db
    .query('matches')
    .withIndex('by_tournament_and_round')
    .filter((q) => q.eq(q.field('tournamentId'), tournamentId))
    .filter((q) => q.eq(q.field('round'), currentRound))
    .collect()

  if (matches.every((m) => m.status === 'completed')) {
    const winners = matches.map((m) => m.winnerId!)
    if (winners.length === 1) {
      // Tournament is over
      await ctx.db.patch(tournamentId, {
        status: 'completed',
        completedAt: Date.now()
      })
    } else {
      // Create next round matches
      for (let i = 0; i < winners.length; i += 2) {
        await ctx.db.insert('matches', {
          tournamentId: tournamentId,
          round: currentRound + 1,
          player1Id: winners[i],
          player2Id: winners[i + 1],
          player1Score: 0,
          player2Score: 0,
          status: 'pending',
          isFinal: winners.length === 2 // If only 2 winners, next match is the final
        })
      }
    }
  }
}
