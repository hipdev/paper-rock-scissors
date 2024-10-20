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

export default function TournamentsPage() {
  const tournaments = useQuery(api.tournaments.getOpenTournaments)
  const createTournament = useMutation(api.tournaments.createTournament)
  const deleteTournament = useMutation(api.tournaments.deleteTournament)

  const user = useQuery(api.users.currentUser)
  console.log(user)

  const formRef = useRef<HTMLFormElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateTournament = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const gameType = formData.get('gameType') as 'single_elimination' | 'best_of_two'

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
    open: 'Abierto',
    in_progress: 'En progreso',
    completed: 'Completado'
  }

  const handleDeleteTournament = async (tournamentId: Id<'tournaments'>) => {
    try {
      await deleteTournament({ tournamentId })
      toast.success('Torneo eliminado correctamente')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Torneos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Crear Torneo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Torneo</DialogTitle>
              <DialogDescription>Ingresa los detalles para el nuevo torneo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTournament} ref={formRef}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Nombre
                  </Label>
                  <Input id='name' name='name' className='col-span-3' required />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='gameType' className='text-right'>
                    Tipo
                  </Label>
                  <Select name='gameType' defaultValue='single_elimination'>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Selecciona un tipo de torneo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='single_elimination'>Eliminación directa</SelectItem>
                      <SelectItem value='best_of_two'>Mejor de dos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex justify-end'>
                <Button type='submit'>Crear Torneo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>Una lista de torneos abiertos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado en</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments?.map((tournament) => (
            <TableRow key={tournament._id}>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>
                {tournament.gameType === 'single_elimination'
                  ? 'Eliminación directa'
                  : 'Mejor de dos'}
              </TableCell>
              <TableCell>{gameStatus[tournament.status]}</TableCell>
              <TableCell>{new Date(tournament.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className='flex gap-3'>
                  <Button variant='outline' size='sm'>
                    Jugar
                  </Button>

                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDeleteTournament(tournament._id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}