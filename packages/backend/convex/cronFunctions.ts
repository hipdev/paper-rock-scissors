import { internalMutation } from './_generated/server'
import { Id } from './_generated/dataModel'

// TODO: Notitications will not be ready for the hackathon :c
export const processReservations = internalMutation({
  handler: async (ctx) => {
    const now = Date.now()
    const oneHourFromNow = now + 60 * 60 * 1000

    const upcomingReservations = await ctx.db
      .query('reservations')
      .filter((q) =>
        q.and(
          q.gt(q.field('reservationTime'), now),
          q.lte(q.field('reservationTime'), oneHourFromNow),
          q.eq(q.field('status'), 'pending'),
          q.eq(q.field('notificationSent'), false)
        )
      )
      .collect()

    for (const reservation of upcomingReservations) {
      const commonArea = await ctx.db.get(reservation.commonAreaId)

      await createNotification(
        ctx,
        reservation.userId,
        'reservationReminder',
        `Tu reserva de ${commonArea?.name} es en 1 hora. Por favor confirma.`,
        reservation._id
      )

      await ctx.db.patch(reservation._id, { notificationSent: true })
    }
  }
})

async function createNotification(
  ctx: any,
  userId: Id<'users'>,
  type: 'reservationReminder' | 'reservationConfirmation' | 'reservationInvalidation',
  message: string,
  reservationId: Id<'reservations'>
) {
  await ctx.db.insert('notifications', {
    userId,
    type,
    message,
    reservationId,
    isRead: false
  })

  const user = await ctx.db.get(userId)
  await ctx.db.patch(userId, {
    unreadNotifications: (user.unreadNotifications || 0) + 1
  })
}

export const invalidateUnconfirmedReservations = internalMutation({
  handler: async (ctx) => {
    const now = Date.now()
    const thirtyMinutesFromNow = now + 30 * 60 * 1000

    const unconfirmedReservations = await ctx.db
      .query('reservations')
      .filter((q) =>
        q.and(
          q.gt(q.field('reservationTime'), now),
          q.lte(q.field('reservationTime'), thirtyMinutesFromNow),
          q.eq(q.field('status'), 'pending')
        )
      )
      .collect()

    for (const reservation of unconfirmedReservations) {
      await ctx.db.patch(reservation._id, { status: 'noShow' })
      const commonArea = await ctx.db.get(reservation.commonAreaId)
      await createNotification(
        ctx,
        reservation.userId,
        'reservationInvalidation',
        `Tu reserva de ${commonArea?.name} ha sido invalidada por falta de confirmación.`,
        reservation._id
      )
    }
  }
})
