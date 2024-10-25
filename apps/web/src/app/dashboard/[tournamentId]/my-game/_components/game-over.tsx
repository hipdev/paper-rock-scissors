'use client'

import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { playValue } from './play-game'

export const GameOver = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const lostMatch = useQuery(api.tournaments.getLostMatch, { tournamentId })

  return (
    <div>
      <h3 className='text-2xl font-semibold text-red-500'>Ouch!</h3>
      <p className='mt-4 text-lg'>
        <strong>{lostMatch?.winnerIdData?.name}</strong> has won the game, you played{' '}
        <strong className='text-green-500'>
          {playValue[lostMatch?.player1Move as keyof typeof playValue]}
        </strong>{' '}
        against{' '}
        <strong className='text-red-500'>
          {playValue[lostMatch?.player2Move as keyof typeof playValue]}
        </strong>
        .
      </p>

      <div className='mt-4'>
        You can follow the{' '}
        <Link href={`/dashboard/${tournamentId}/ranking`} className='text-blue-500'>
          ranking
        </Link>{' '}
        for this tournament.
      </div>
    </div>
  )
}
