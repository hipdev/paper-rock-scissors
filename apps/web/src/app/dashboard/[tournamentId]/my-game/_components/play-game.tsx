import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { BicepsFlexed, Origami, Scissors } from 'lucide-react'
import { useState } from 'react'
import { GameOver } from './game-over'
import { cn } from '@/lib/utils'

export const playValue = {
  rock: 'piedra',
  paper: 'papel',
  scissors: 'tijeras'
}

export const PlayGame = ({ tournamentId }: { tournamentId: Id<'tournaments'> }) => {
  const [userMove, setUserMove] = useState<'rock' | 'paper' | 'scissors' | null>(null)

  const currentMatch = useQuery(api.tournaments.getCurrentMatch, { tournamentId })
  const playGame = useMutation(api.tournaments.playGame)

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
        {currentMatch.isFinal ? 'Gran Final' : 'Partida actual'}
      </h2>

      {!currentMatch.isFinal && <p>Ronda: {currentMatch.round} </p>}

      <p>
        Puntajes: {currentMatch.player1Name}: {currentMatch.player1Score} -{' '}
        {currentMatch.player2Name}: {currentMatch.player2Score}
      </p>

      {currentMatch && (
        <div>
          {currentMatch.isYourTurn ? (
            <div className='mt-5'>
              <p>Es tu turno! Elige tu jugada:</p>
              <div className='mt-5 flex gap-12'>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('rock')}
                >
                  <BicepsFlexed className='h-5 w-5' />
                  Piedra
                </button>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('paper')}
                >
                  <Origami className='h-5 w-5' />
                  Papel
                </button>
                <button
                  className='flex gap-2 rounded-md border border-white/60 px-4 py-2 transition-colors hover:border-white'
                  onClick={() => handleMove('scissors')}
                >
                  <Scissors className='h-5 w-5' />
                  Tijeras
                </button>
              </div>
            </div>
          ) : (
            <p className='mt-4'>Esperando a tu oponente...</p>
          )}
        </div>
      )}

      {currentMatch.status === 'pending' && userMove && (
        <div className='mt-4'>
          <p>
            Jugaste <span className='font-semibold text-green-500'>{playValue[userMove]}</span>{' '}
          </p>
        </div>
      )}
    </div>
  )
}
