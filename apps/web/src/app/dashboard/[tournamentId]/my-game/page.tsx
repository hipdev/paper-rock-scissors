'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useParams } from 'next/navigation'

export default function TournamentPage() {
  const { tournamentId } = useParams() as { tournamentId: Id<'tournaments'> }
  const { isAuthenticated } = useConvexAuth()

  const user = useQuery(api.users.currentUser)
  const userId = user?._id as Id<'users'>

  const tournament = useQuery(api.tournaments.getTournament, { tournamentId })

  console.log(tournament, 'currentMatch')

  const playGame = useMutation(api.tournaments.playGame)

  const [userMove, setUserMove] = useState<'rock' | 'paper' | 'scissors' | null>(null)

  if (!isAuthenticated || !tournament) {
    return <div>Loading...</div>
  }

  // const handleMove = async (move: 'rock' | 'paper' | 'scissors') => {

  //   setUserMove(move)
  //   await playGame({
  //     matchId: tournament.matches[0]._id,
  //     playerId: userId,
  //     move
  //   })
  // }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{tournament.name}</h1>
      <p>Status: {tournament.status}</p>

      {tournament.status === 'open' && tournament.status === 'open' && (
        <p>Waiting for the tournament to start...</p>
      )}

      {/* {tournament.status === 'in_progress' && currentMatch && (
        <div>
          <h2 className='mb-2 mt-4 text-xl font-semibold'>Your Current Match</h2>
          <p>Round: {currentMatch.round}</p>
          <p>
            Score: {currentMatch.player1Score} - {currentMatch.player2Score}
          </p>

          {currentMatch.status === 'pending' && (
            <div className='mt-4'>
              <p>Make your move:</p>
              <div className='mt-2 flex space-x-2'>
                {['rock', 'paper', 'scissors'].map((move) => (
                  <button
                    key={move}
                    onClick={() => handleMove(move as 'rock' | 'paper' | 'scissors')}
                    className='rounded bg-green-500 px-4 py-2 text-white'
                    disabled={!!userMove}
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>
          )}

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
      )}

      {tournament.status === 'completed' && (
        <p className='mt-4 font-semibold'>The tournament has ended.</p>
      )} */}
    </div>
  )
}
