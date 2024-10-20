import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutación para reiniciar el contador de notificaciones no leídas
export const resetUnreadNotificationsCount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { unreadNotifications: 0 });
  },
});

// Query para obtener el contador de notificaciones no leídas
export const getUnreadNotificationsCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.unreadNotifications || 0;
  },
});

// Query para obtener las notificaciones de un usuario
export const getUserNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});
