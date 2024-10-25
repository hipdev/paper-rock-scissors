import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { BicepsFlexed, Origami, Scissors } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GameOver } from './game-over'
import { cn } from '@/lib/utils'

export const playValue = {
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors'
}

export const PlayGame = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const [userMove, setUserMove] = useState<'rock' | 'paper' | 'scissors' | null>(null)

  const currentMatch = useQuery(api.tournaments.getCurrentMatch, { tournamentId })
  const playGame = useMutation(api.tournaments.playGame)

  useEffect(() => {
    if (currentMatch?.status === 'completed') {
      setUserMove(null)
    }
  }, [currentMatch?._id])

  const handleMove = async (move: 'rock' | 'paper' | 'scissors') => {
    if (!currentMatch) return

    setUserMove(move)

    await playGame({
      matchId: currentMatch._id,
      move
    })
  }
  console.log('move', currentMatch)

  if (!currentMatch) return <GameOver tournamentId={tournamentId} />

  return (
    <div>
      <h2
        className={cn('mb-2 mt-4 text-xl font-semibold', currentMatch.isFinal && 'text-green-500')}
      >
        {currentMatch.isFinal ? 'Big final' : 'Current match'}
      </h2>

      {!currentMatch.isFinal && <p>Round: {currentMatch.round} </p>}

      <p>
        Scores: {currentMatch.player1Name}: {currentMatch.player1Score} - {currentMatch.player2Name}
        : {currentMatch.player2Score}
      </p>

      {currentMatch && (
        <div>
          {currentMatch.lastGameResult === 'tie' && (
            <p className='mt-4 text-lg text-yellow-500'>The last game was a tie</p>
          )}
          {currentMatch.lastGameResult !== 'tie' && (
            <p>The winner of the last game was {currentMatch.lastGameWinnerName}</p>
          )}

          {currentMatch.isYourTurn && currentMatch.status !== 'completed' ? (
            <div className='mt-5'>
              <p>It's your turn! Choose your move:</p>
              <div className='mt-5 flex gap-12'>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('rock')}
                >
                  <BicepsFlexed className='h-5 w-5' />
                  Rock
                </button>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('paper')}
                >
                  <Origami className='h-5 w-5' />
                  Paper
                </button>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('scissors')}
                >
                  <Scissors className='h-5 w-5' />
                  Scissors
                </button>
              </div>
            </div>
          ) : !currentMatch.isYourTurn && currentMatch.status !== 'completed' ? (
            <p className='mt-4'>Waiting for your opponent...</p>
          ) : (
            <p className='mt-4'>Waiting for current brackets to finish...</p>
          )}
        </div>
      )}

      {currentMatch.status === 'pending' && userMove && (
        <div className='mt-4'>
          <p>
            You played <span className='font-semibold text-green-500'>{playValue[userMove]}</span>{' '}
          </p>
        </div>
      )}
    </div>
  )
}
