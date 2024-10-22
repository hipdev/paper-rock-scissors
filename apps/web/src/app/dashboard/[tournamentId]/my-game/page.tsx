'use client'

import React from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import { PlayGame } from './_components/play-game'

export default function TournamentPage() {
  const { tournamentId } = useParams() as { tournamentId: Id<'tournaments'> }
  const { isAuthenticated } = useConvexAuth()

  const tournament = useQuery(api.tournaments.getTournament, { tournamentId })
  const tournamentDetails = useQuery(api.tournaments.getTournamentDetails, { tournamentId })

  if (!isAuthenticated || !tournament) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{tournament.name}</h1>
      <p>Status: {tournament.status}</p>

      {tournament.status === 'open' && tournament.status === 'open' && (
        <p>Waiting for the tournament to start...</p>
      )}

      {tournament.status === 'in_progress' && <PlayGame tournamentId={tournamentId} />}

      {tournament.status === 'completed' && (
        <p className='mt-4 font-semibold'>The tournament has ended.</p>
      )}
    </div>
  )
}
