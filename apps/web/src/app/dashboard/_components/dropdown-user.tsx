'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { useSidebarStore } from './sidebar-store'
import { cn } from '@/lib/utils'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'

export default function DropdownUser() {
  const user = useQuery(api.users.currentUser, {})

  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const { signOut } = useAuthActions()
  const router = useRouter()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='hover:text-primary group w-full gap-2 border-t border-t-white/10 px-0 py-4 transition-colors'>
        <div className={cn('flex items-center justify-between', isCollapsed ? 'px-2.5' : 'px-5')}>
          <div className='flex items-center justify-between gap-2'>
            <Image
              src='/assets/midnight.webp'
              width={20}
              height={20}
              className='h-6 w-6 rounded-full opacity-80 transition-opacity hover:opacity-100'
              alt='User avatar'
              title='User settings'
            />
            <span className={cn('relative block max-w-24 truncate', isCollapsed && 'hidden')}>
              {user?.name || user?.email}
            </span>
          </div>
          <Ellipsis
            className={cn(
              'text-neutral-500 group-hover:text-neutral-500/70',
              isCollapsed && 'hidden'
            )}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44 border-none bg-black text-white/80'>
        <DropdownMenuItem>Mi cuenta</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='#'>Administración</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-white/15' />
        <DropdownMenuItem
          onClick={() => {
            signOut()
            router.push('/')
          }}
        >
          Cerrar sesión
        </DropdownMenuItem>
        <DropdownMenuArrow className='fill-secondary-foreground' />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
