'use client'

import { Bell, Building2, Handshake, Home, Trophy, Users } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSidebarStore } from './sidebar-store'
import CustomLink from '@/components/design-system/custom-link'
import { Id } from '@packages/backend/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { Input } from '@/components/ui/input'

export default function AsideNav() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const user = useQuery(api.users.currentUser)
  const updateUserName = useMutation(api.users.updateUserName)

  const iconClassName = cn(
    'h-auto w-5 text-sm',
    isCollapsed ? 'text-neutral-500' : 'text-gray-500/80'
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    await updateUserName({ name })
  }

  return (
    <nav>
      <CustomLink
        href={`/dashboard/users`}
        IconComponent={<Users size={20} className={iconClassName} />}
        label='Players'
        isCollapsed={isCollapsed}
      />
      {user?.name && (
        <CustomLink
          href='/dashboard/tournaments'
          IconComponent={<Users size={20} className={iconClassName} />}
          label='Tournaments'
          isCollapsed={isCollapsed}
        />
      )}

      {!user?.name && (
        <form
          onSubmit={handleSubmit}
          className='mt-7 flex flex-col items-center justify-center gap-2 px-6'
        >
          <label htmlFor='name'>Please enter your name</label>
          <Input name='name' />
        </form>
      )}
    </nav>
  )
}
