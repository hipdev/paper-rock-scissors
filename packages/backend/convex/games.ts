import { query } from './_generated/server'
import { v } from 'convex/values'

export const getGamesForMatch = query({
  args: { matchId: v.id('matches') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('games')
      .withIndex('by_match', (q) => q.eq('matchId', args.matchId))
      .collect()
  }
})
