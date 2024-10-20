'use client'

import { cn } from '@/lib/utils'
import { useSidebarStore } from './sidebar-store'

export default function MainWrapper({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  return <div className={cn('w-full', isCollapsed ? 'pl-11' : 'pl-52')}>{children}</div>
}
