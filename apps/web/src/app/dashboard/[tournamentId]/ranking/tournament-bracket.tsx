import React, { useMemo } from 'react'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'

interface Match {
  _id: Id<'matches'>
  player1Id: Id<'users'>
  player2Id: Id<'users'>
  player1Score: number
  player2Score: number
  round: number
  status: 'pending' | 'in_progress' | 'completed'
  winnerId?: Id<'users'>
}

interface Props {
  matches: Match[]
}

export const TournamentBracket: React.FC<Props> = ({ matches }) => {
  const rounds = useMemo(() => organizeMatchesByRound(matches), [matches])

  console.log(rounds, 'current rounds')

  return (
    <div className='flex flex-nowrap overflow-x-auto'>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className='mx-4 flex flex-col items-center'>
          <div className='flex h-full flex-col justify-center space-y-4'>
            <h2 className='mb-2 text-center text-lg font-semibold'>
              {roundIndex === rounds.length - 1 ? 'Final' : `Round ${roundIndex + 1}`}
            </h2>
            {round.map((match) => (
              <div key={match._id} className='w-64 rounded-lg bg-gray-800 p-4'>
                <div className='flex flex-col space-y-2'>
                  <UserSlot
                    userId={match.player1Id}
                    score={match.player1Score}
                    isWinner={match.winnerId === match.player1Id}
                  />
                  <UserSlot
                    userId={match.player2Id}
                    score={match.player2Score}
                    isWinner={match.winnerId === match.player2Id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const UserSlot: React.FC<{ userId: Id<'users'>; score: number; isWinner: boolean }> = ({
  userId,
  score,
  isWinner
}) => {
  const user = useQuery(api.users.getUserById, { userId })

  if (!user) {
    return <div className='h-8 rounded bg-gray-700'></div>
  }

  return (
    <div
      className={`flex items-center justify-between rounded p-2 ${isWinner ? 'bg-green-700' : 'bg-gray-700'}`}
    >
      <span className='truncate'>{user.name}</span>
      <span className='font-semibold'>{score}</span>
    </div>
  )
}

function organizeMatchesByRound(matches: Match[]): Match[][] {
  const roundsMap = new Map<number, Match[]>()

  matches.forEach((match) => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, [])
    }
    roundsMap.get(match.round)!.push(match)
  })

  return Array.from(roundsMap.values())
}
