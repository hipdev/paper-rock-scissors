'use client'

import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { playValue } from './play-game'

export const GameOver = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const lostMatch = useQuery(api.tournaments.getLostMatch, { tournamentId })

  console.log('lostMatch', lostMatch)

  return (
    <div>
      <h3 className='text-2xl font-semibold text-red-500'>Rayos!</h3>
      <p className='mt-4 text-lg'>
        <strong>{lostMatch?.winnerIdData?.name}</strong> ha ganado el juego, jugaste{' '}
        <strong>{playValue[lostMatch?.player1Move as keyof typeof playValue]}</strong> contra{' '}
        <strong>{playValue[lostMatch?.player2Move as keyof typeof playValue]}</strong>.
      </p>

      <div className='mt-4'>
        Puedes seguir el{' '}
        <Link href={`/dashboard/${tournamentId}/ranking`} className='text-blue-500'>
          ranking
        </Link>{' '}
        para este torneo.
      </div>
    </div>
  )
}
