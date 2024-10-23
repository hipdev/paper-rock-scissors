'use client'

import React, { useRef, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react'
import { ConvexError } from 'convex/values'

type TournamentStatus = 'open' | 'in_progress' | 'completed'

export default function TournamentsPage() {
  const user = useQuery(api.users.currentUser)
  const tournaments = useQuery(api.tournaments.getTournaments)
  const createTournament = useMutation(api.tournaments.createTournament)
  const deleteTournament = useMutation(api.tournaments.deleteTournament)
  const joinTournament = useMutation(api.tournaments.joinTournament)
  const startTournament = useMutation(api.tournaments.startTournament)
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateTournament = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const gameType = formData.get('gameType') as 'best_of_one' | 'best_of_two'

    try {
      await createTournament({ name, gameType })
      formRef.current?.reset()
      setIsDialogOpen(false) // Close the dialog on successful submission
    } catch (error) {
      console.error('Failed to create tournament:', error)
      toast.error('Failed to create tournament')
      // Optionally, you can show an error message to the user here
    }
  }

  const gameStatus = {
    open: 'Open',
    in_progress: 'In progress',
    completed: 'Completed'
  }

  const handleDeleteTournament = async (tournamentId: Id<'tournaments'>) => {
    try {
      await deleteTournament({ tournamentId })
      toast.success('Tournament deleted successfully')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const handleJoinTournament = async ({
    tournamentId,
    status
  }: {
    tournamentId: Id<'tournaments'>
    status: TournamentStatus
  }) => {
    if (status === 'in_progress') {
      router.push(`/dashboard/${tournamentId}/my-game`)
      return
    }

    try {
      await joinTournament({ tournamentId })
      router.push(`/dashboard/${tournamentId}/my-game`)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const handleStartTournament = async (tournamentId: Id<'tournaments'>) => {
    try {
      await startTournament({ tournamentId })
    } catch (error) {
      const errorMessage = error instanceof ConvexError ? error.data : 'There was an error'

      toast.error(errorMessage)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Tournaments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Tournament</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tournament</DialogTitle>
              <DialogDescription>Enter the details for the new tournament.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTournament} ref={formRef}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input id='name' name='name' className='col-span-3' required />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='gameType' className='text-right'>
                    Type
                  </Label>
                  <Select name='gameType' defaultValue='best_of_one'>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select a tournament type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='best_of_one'>Best of one</SelectItem>
                      <SelectItem value='best_of_two'>Best of two</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex justify-end'>
                <Button type='submit'>Create Tournament</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader className='hover:bg-none'>
          <TableRow className='hover:bg-transparent'>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments?.map((tournament) => (
            <TableRow key={tournament._id} className='hover:bg-neutral-900'>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>
                {tournament.gameType === 'best_of_one' ? 'Direct elimination' : 'Best of two'}
              </TableCell>
              <TableCell>{tournament.playerCount}</TableCell>
              <TableCell>{gameStatus[tournament.status]}</TableCell>
              <TableCell>{new Date(tournament.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className='flex items-center gap-5'>
                  {tournament.status !== 'completed' && (
                    <button
                      type='button'
                      className='py-1 text-green-600'
                      onClick={() =>
                        handleJoinTournament({
                          tournamentId: tournament._id,
                          status: tournament.status
                        })
                      }
                    >
                      Play
                    </button>
                  )}
                  <Link
                    className='py-1 text-blue-600'
                    href={`/dashboard/${tournament._id}/ranking`}
                  >
                    Ranking
                  </Link>
                  {user?.isAdmin && (
                    <>
                      {tournament.status === 'open' && (
                        <button
                          type='button'
                          className='py-1 text-green-600'
                          onClick={() => handleStartTournament(tournament._id)}
                        >
                          Start
                        </button>
                      )}
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteTournament(tournament._id)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
