'use client'

import React from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import { PlayGame } from './_components/play-game'
import { TournamentWinner } from './_components/tournament-winner'

const TournamentStatus = {
  open: 'Abierto',
  in_progress: 'En curso',
  completed: 'Finalizado'
}

export default function TournamentPage() {
  const { tournamentId } = useParams() as { tournamentId: Id<'tournaments'> }
  const { isAuthenticated } = useConvexAuth()

  const tournament = useQuery(api.tournaments.getTournament, { tournamentId })

  if (!isAuthenticated || !tournament) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='mb-4 text-2xl font-bold'>{tournament.name}</h1>
        <p>Estado: {TournamentStatus[tournament.status]}</p>
      </div>

      {tournament.status === 'open' && tournament.status === 'open' && (
        <p>Waiting for the tournament to start...</p>
      )}

      {tournament.status === 'in_progress' && <PlayGame tournamentId={tournamentId} />}

      {tournament.status === 'completed' && <TournamentWinner tournamentId={tournamentId} />}
    </div>
  )
}
