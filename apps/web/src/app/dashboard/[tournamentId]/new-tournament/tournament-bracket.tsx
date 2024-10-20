import React, { useMemo } from 'react'

interface Player {
  id: number
  name: string
  score: number
}

interface Match {
  id: number
  player1: Player | null
  player2: Player | null
  winner: Player | null
}

interface Props {
  players: Player[]
}

export const TournamentBracket: React.FC<Props> = ({ players }) => {
  const rounds = useMemo(() => generateBracket(players), [players])

  return (
    <div className='flex flex-nowrap overflow-x-auto'>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className='mx-4 flex flex-col items-center'>
          <div className='flex h-full flex-col justify-center space-y-4'>
            <h2 className='mb-2 text-center text-lg font-semibold'>
              {roundIndex === rounds.length - 1 ? 'Final' : `Round ${roundIndex + 1}`}
            </h2>
            {round.map((match) => (
              <div key={match.id} className='w-64 rounded-lg bg-gray-800 p-4'>
                <div className='flex flex-col space-y-2'>
                  <PlayerSlot player={match.player1} />
                  <PlayerSlot player={match.player2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const PlayerSlot: React.FC<{ player: Player | null }> = ({ player }) => {
  if (!player) {
    return <div className='h-8 rounded bg-gray-700'></div>
  }

  return (
    <div className='flex items-center justify-between rounded bg-gray-700 p-2'>
      <span className='truncate'>{player.name}</span>
      <span className='font-semibold'>{player.score}</span>
    </div>
  )
}

function generateBracket(players: Player[]): Match[][] {
  const rounds: Match[][] = []
  let currentRound: Match[] = []
  let matchId = 1

  // Generate first round
  for (let i = 0; i < players.length; i += 2) {
    currentRound.push({
      id: matchId++,
      player1: players[i] || null,
      player2: players[i + 1] || null,
      winner: null
    })
  }
  rounds.push(currentRound)

  // Generate subsequent rounds
  while (currentRound.length > 1) {
    const nextRound: Match[] = []
    for (let i = 0; i < currentRound.length; i += 2) {
      nextRound.push({
        id: matchId++,
        player1: null,
        player2: null,
        winner: null
      })
    }
    rounds.push(nextRound)
    currentRound = nextRound
  }

  return rounds
}
