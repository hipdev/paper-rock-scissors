'use client'

import { Bell, Building2, Handshake, Home, Trophy, Users } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSidebarStore } from './sidebar-store'
import CustomLink from '@/components/design-system/custom-link'
import { Id } from '@packages/backend/convex/_generated/dataModel'

export default function AsideNav() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  const iconClassName = cn(
    'h-auto w-5 text-sm',
    isCollapsed ? 'text-neutral-500' : 'text-gray-500/80'
  )

  return (
    <nav>
      <CustomLink
        href={`/dashboard/users`}
        IconComponent={<Users size={20} className={iconClassName} />}
        label='Jugadores'
        isCollapsed={isCollapsed}
      />
      <CustomLink
        href='/dashboard/tournaments'
        IconComponent={<Users size={20} className={iconClassName} />}
        label='Torneos'
        isCollapsed={isCollapsed}
      />

      <h5
        className={cn(
          'pb-2 pl-5 pt-10 font-medium uppercase text-gray-500',
          isCollapsed && 'hidden'
        )}
      >
        Recursos
      </h5>

      <div className={cn('w-full border-t border-white/30 px-5 pt-6', !isCollapsed && 'hidden')} />

      <CustomLink
        href='/dashboard/new-tournament'
        IconComponent={<Trophy size={20} className={iconClassName} />}
        label='Nuevo Torneo'
        isCollapsed={isCollapsed}
      />
    </nav>
  )
}
