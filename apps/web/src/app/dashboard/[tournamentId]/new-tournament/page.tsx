import React from 'react'
import { TournamentBracket } from './tournament-bracket'

export default function NewTournamentPage() {
  const players = [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
    { id: 4, name: 'Player 4', score: 0 },
    { id: 5, name: 'Player 5', score: 0 },
    { id: 6, name: 'Player 6', score: 0 },
    { id: 7, name: 'Player 7', score: 0 },
    { id: 8, name: 'Player 8', score: 0 },
    { id: 9, name: 'Player 9', score: 0 },
    { id: 10, name: 'Player 10', score: 0 },
    { id: 11, name: 'Player 11', score: 0 },
    { id: 12, name: 'Player 12', score: 0 },
    { id: 13, name: 'Player 13', score: 0 },
    { id: 14, name: 'Player 14', score: 0 },
    { id: 15, name: 'Player 15', score: 0 },
    { id: 16, name: 'Player 16', score: 0 }
    // Add more players as needed
  ]

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Rock, Paper, Scissors Tournament</h1>
      <TournamentBracket players={players} />
    </div>
  )
}
