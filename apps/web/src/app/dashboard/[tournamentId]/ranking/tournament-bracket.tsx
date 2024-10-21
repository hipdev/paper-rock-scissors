import React from 'react'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'

interface Props {
  tournamentId: Id<'tournaments'>
}

export const TournamentBracket: React.FC<Props> = ({ tournamentId }) => {
  const tournamentUsers = useQuery(api.tournaments.getTournamentUsers, { tournamentId })
  const tournament = useQuery(api.tournaments.getTournament, { tournamentId })
  const startTournament = useMutation(api.tournaments.startTournament)

  if (!tournamentUsers || !tournament) {
    return <div>Loading...</div>
  }

  const handleStartTournament = async () => {
    await startTournament({ tournamentId })
  }

  if (tournament.status === 'open') {
    return (
      <div className='p-4'>
        <h2 className='mb-4 text-2xl font-bold'>Waiting Players</h2>
        <ul className='space-y-2'>
          {tournamentUsers.map((user) => (
            <li key={user._id} className='rounded bg-gray-800 p-2'>
              {user.userInfo?.name || user.userInfo?.email}
            </li>
          ))}
        </ul>
        {tournamentUsers.length >= 2 && tournamentUsers.length % 2 === 0 && (
          <button
            onClick={handleStartTournament}
            className='mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
          >
            Start Tournament
          </button>
        )}
      </div>
    )
  }

  // If the tournament has started, show the brackets (you can implement this part later)
  return <div>Tournament has started. Bracket view to be implemented.</div>
}
