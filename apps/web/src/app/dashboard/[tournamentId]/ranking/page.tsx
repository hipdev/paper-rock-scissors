'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import { TournamentBracket } from './tournament-bracket'

export default function TournamentPage() {
  const { tournamentId } = useParams()
  const tournament = useQuery(api.tournaments.getTournamentDetails, {
    tournamentId: tournamentId as Id<'tournaments'>
  })

  if (!tournament) {
    return null
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{tournament.tournament.name}</h1>
      <TournamentBracket tournamentId={tournamentId as Id<'tournaments'>} />
    </div>
  )
}
