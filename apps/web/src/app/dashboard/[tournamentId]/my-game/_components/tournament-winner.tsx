'use client'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useQuery } from 'convex/react'

export const TournamentWinner = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const tournamentWinner = useQuery(api.tournaments.getTournamentWinner, { tournamentId })

  return (
    <>
      <p className='mt-4 font-semibold'>The tournament has ended.</p>
      {tournamentWinner && (
        <p className='mt-10 text-4xl font-semibold'>
          The winner of the tournament is {tournamentWinner.winnerName} <br /> ID:{' '}
          {tournamentWinner.winnerId}!
        </p>
      )}
    </>
  )
}
