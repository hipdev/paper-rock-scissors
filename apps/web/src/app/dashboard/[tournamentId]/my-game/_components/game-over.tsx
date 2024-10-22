'use client'

import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useQuery } from 'convex/react'

export const GameOver = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const lostMatch = useQuery(api.tournaments.getLostMatch, { tournamentId })

  console.log('lostMatch', lostMatch)

  return <div>GameOver</div>
}
