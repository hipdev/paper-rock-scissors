'use client'

import { useState } from 'react'
import { Eye, Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '@packages/backend/convex/_generated/api'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const params = useParams()

  const users = useQuery(api.users.getUsers)
  const filteredUsers = users?.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className='min-h-screen bg-black p-8 text-white'>
      <div className='mx-auto max-w-6xl space-y-8'>
        <h1 className='text-3xl font-bold'>Users</h1>

        <Input
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border-neutral-700 bg-neutral-800 focus-visible:ring-neutral-400'
        />

        <div className='overflow-hidden rounded-md border border-neutral-700'>
          <Table>
            <TableHeader className='bg-neutral-900'>
              <TableRow className='text-white hover:bg-neutral-800'>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className='border-t border-neutral-700 hover:bg-neutral-800'
                  >
                    <TableCell className='font-medium'>{`${user.name || 'Unassigned'} ${user.lastName || ''}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user?.phone || 'No phone'}</TableCell>

                    <TableCell className='flex items-center space-x-2'>
                      <button
                        type='button'
                        className='relative top-px flex items-center gap-2 hover:text-indigo-500'
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className='hover:bg-neutral-800'>
                  <TableCell colSpan={6} className='text-center'>
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
