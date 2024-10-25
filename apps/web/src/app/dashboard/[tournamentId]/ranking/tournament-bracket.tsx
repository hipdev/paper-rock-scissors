import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'

const Match = ({ match }: { match: any }) => (
  <div className='flex flex-col rounded-lg bg-gray-800 p-2'>
    <div
      className={`flex justify-between ${match.winnerId === match.player1Id ? 'font-bold' : ''}`}
    >
      <span>{match.player1Name}</span>
      <span>{match.player1Score}</span>
    </div>
    <div
      className={`flex justify-between ${match.winnerId === match.player2Id ? 'font-bold' : ''}`}
    >
      <span>{match.player2Name}</span>
      <span>{match.player2Score}</span>
    </div>
  </div>
)

export const TournamentBracket = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const tournamentDetails = useQuery(api.tournaments.getTournamentDetails, { tournamentId })

  if (!tournamentDetails) return <div>Loading...</div>

  const { tournament, roundMatches, winner } = tournamentDetails

  return (
    <div className='flex flex-col items-center'>
      <h1 className='mb-4 text-2xl font-bold'>
        {tournament.name} - {tournament.status}
      </h1>
      <div className='flex space-x-8'>
        {Object.entries(roundMatches).map(([round, matches]) => (
          <div key={round} className='flex flex-col space-y-4'>
            <h2 className='text-xl font-semibold'>Round {round}</h2>
            {matches.map((match) => (
              <Match key={match._id} match={match} />
            ))}
          </div>
        ))}
      </div>
      {winner && (
        <div className='mt-8'>
          <h2 className='text-2xl font-bold'>Tournament Winner</h2>
          <p className='text-xl'>{winner.name}</p>
        </div>
      )}
    </div>
  )
}
