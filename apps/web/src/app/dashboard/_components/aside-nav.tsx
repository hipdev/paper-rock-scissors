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
        label='Players'
        isCollapsed={isCollapsed}
      />
      <CustomLink
        href='/dashboard/tournaments'
        IconComponent={<Users size={20} className={iconClassName} />}
        label='Tournaments'
        isCollapsed={isCollapsed}
      />
    </nav>
  )
}
