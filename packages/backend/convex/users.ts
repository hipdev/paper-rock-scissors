import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    return await ctx.db.get(userId)
  }
})

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').collect()
  }
})

export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('_id'), args.userId))
      .first()
  }
})

export const updateUserName = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      return null
    }
    return await ctx.db.patch(userId, { name: args.name })
  }
})

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    lastName: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new Error('No estás autenticado')
    }

    const updates: { name?: string; lastName?: string } = {}
    if (args.name !== undefined) updates.name = args.name
    if (args.lastName !== undefined) updates.lastName = args.lastName

    return await ctx.db.patch(userId, updates)
  }
})

export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  }
})
