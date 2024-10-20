import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

// crons.interval('process reservations', { minutes: 10 }, internal.cronFunctions.processReservations)

// crons.interval(
//   'invalidate unconfirmed reservations',
//   { minutes: 10 },
//   internal.cronFunctions.invalidateUnconfirmedReservations
// )

export default crons
