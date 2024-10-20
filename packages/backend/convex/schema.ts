import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'

const schema = defineSchema({
  ...authTables,
  // Tabla para almacenar información de los usuarios
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    isAnonymous: v.optional(v.boolean()),
    isAuthorized: v.optional(v.boolean()),
    isSuperAdmin: v.optional(v.boolean()),
    lastName: v.optional(v.string()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number())
  }).index('email', ['email'])
})

export default schema
