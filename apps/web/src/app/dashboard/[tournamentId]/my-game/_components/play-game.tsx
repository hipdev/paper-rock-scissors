import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'

export const PlayGame = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const [userMove, setUserMove] = useState<'rock' | 'paper' | 'scissors' | null>(null)

  const currentMatch = useQuery(api.tournaments.getCurrentMatch, { tournamentId })
  const playGame = useMutation(api.tournaments.playGame)

  const handleMove = async (move: 'rock' | 'paper' | 'scissors') => {
    setUserMove(move)
    // await playGame({
    //   matchId: tournament.matches[0]._id,
    //   playerId: userId,
    //   move
    // })
  }

  if (!currentMatch) return null

  return (
    <div>
      <h2 className='mb-2 mt-4 text-xl font-semibold'>Your Current Match</h2>
      <p>Round: {currentMatch.round}</p>
      <p>
        Score: {currentMatch.player1Score} - {currentMatch.player2Score}
      </p>

      {currentMatch && (
        <div>
          <h2>Current Match</h2>
          {currentMatch.isYourTurn ? (
            <div>
              <p>It's your turn! Make your move:</p>
              <button onClick={() => handleMove('rock')}>Rock</button>
              <button onClick={() => handleMove('paper')}>Paper</button>
              <button onClick={() => handleMove('scissors')}>Scissors</button>
            </div>
          ) : (
            <p>Waiting for your opponent to make a move...</p>
          )}
        </div>
      )}

      {currentMatch.status === 'in_progress' && userMove && (
        <p className='mt-4'>You played {userMove}. Waiting for opponent...</p>
      )}
    </div>
  )
}
