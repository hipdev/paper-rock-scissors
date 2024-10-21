import React, { useMemo } from 'react'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'

interface Props {
  tournamentId: Id<'tournaments'>
}

export const TournamentBracket: React.FC<Props> = ({ tournamentId }) => {
  const tournamentUsers = useQuery(api.tournaments.getTournamentUsers, { tournamentId })
  const tournament = useQuery(api.tournaments.getTournament, { tournamentId })
  const matches = useQuery(api.matches.getMatchesForTournament, { tournamentId })
  const startTournament = useMutation(api.tournaments.startTournament)

  const rounds = useMemo(() => {
    if (!matches) return []
    return organizeMatchesByRound(matches)
  }, [matches])

  if (!tournamentUsers || !tournament || !matches) {
    return <div>Loading...</div>
  }

  const handleStartTournament = async () => {
    await startTournament({ tournamentId })
  }

  if (tournament.status === 'open') {
    // ... (código existente para mostrar jugadores en espera)
  }

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-2xl font-bold'>Tournament Bracket</h2>
      <div className='flex flex-nowrap overflow-x-auto'>
        {rounds.map((round, roundIndex) => (
          <div key={roundIndex} className='mx-4 flex flex-col items-center'>
            <h3 className='mb-2 text-lg font-semibold'>
              {roundIndex === rounds.length - 1 ? 'Final' : `Round ${roundIndex + 1}`}
            </h3>
            <div className='flex flex-col space-y-4'>
              {round.map((match) => (
                <MatchCard key={match._id} match={match} tournamentUsers={tournamentUsers} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MatchCard: React.FC<{ match: any; tournamentUsers: any[] }> = ({
  match,
  tournamentUsers
}) => {
  const games = useQuery(api.games.getGamesForMatch, { matchId: match._id })
  const getUser = (userId: Id<'users'>) =>
    tournamentUsers.find((user) => user.userId === userId)?.userInfo

  const user1 = getUser(match.player1Id)
  const user2 = getUser(match.player2Id)

  return (
    <div className='w-64 rounded-lg bg-gray-800 p-4'>
      <div className='flex flex-col space-y-2'>
        <UserSlot
          name={user1?.name || user1?.email || 'Unknown'}
          score={match.player1Score}
          isWinner={match.winnerId === match.player1Id}
        />
        <UserSlot
          name={user2?.name || user2?.email || 'Unknown'}
          score={match.player2Score}
          isWinner={match.winnerId === match.player2Id}
        />
      </div>
      <div className='mt-2 text-sm text-gray-400'>Status: {match.status}</div>
      {match.status === 'completed' && games && (
        <div className='mt-2'>
          <h4 className='text-sm font-semibold'>Game Results:</h4>
          {games.map((game, index) => (
            <GameResult key={game._id} game={game} index={index} user1={user1} user2={user2} />
          ))}
        </div>
      )}
    </div>
  )
}

const UserSlot: React.FC<{ name: string; score: number; isWinner: boolean }> = ({
  name,
  score,
  isWinner
}) => (
  <div
    className={`flex items-center justify-between rounded p-2 ${isWinner ? 'bg-green-700' : 'bg-gray-700'}`}
  >
    <span className='truncate'>{name}</span>
    <span className='font-semibold'>{score}</span>
  </div>
)

const GameResult: React.FC<{ game: any; index: number; user1: any; user2: any }> = ({
  game,
  index,
  user1,
  user2
}) => (
  <div className='mt-1 text-xs'>
    <span>Game {index + 1}: </span>
    <span>
      {user1?.name || 'Player 1'} ({game.player1Move}) vs{' '}
    </span>
    <span>
      {user2?.name || 'Player 2'} ({game.player2Move})
    </span>
  </div>
)

function organizeMatchesByRound(matches: any[]): any[][] {
  const roundsMap = new Map<number, any[]>()

  matches.forEach((match) => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, [])
    }
    roundsMap.get(match.round)!.push(match)
  })

  return Array.from(roundsMap.values())
}
