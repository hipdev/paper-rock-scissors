'use client'

import { useQuery } from 'convex/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@packages/backend/convex/_generated/api'

import { cn } from '@/lib/utils'
import AsideNav from './aside-nav'
import SidebarFooter from './sidebar-footer'
import { useSidebarStore } from './sidebar-store'
import Logo from '@/components/design-system/logo'

export default function SideBar() {
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed)
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  return (
    <aside
      className={cn(
        'fixed h-screen border-r border-r-white/5 bg-gradient-to-b from-[#1b1b1b] to-[#101010]',
        isCollapsed ? 'w-11' : 'w-52'
      )}
    >
      {isCollapsed ? (
        <>
          <button
            type='button'
            onClick={() => setIsCollapsed()}
            className='absolute -right-[17px] top-12 rounded-full border border-white/15 bg-black p-1 transition-colors hover:border-white/30 hover:bg-black'
          >
            <ChevronRight className='relative left-px text-neutral-500' size={22} />
          </button>
          <div className='mb-6 border-b border-b-white/10 p-2 py-4'>
            {/* TODO: Add logotype */}
            <span className='relative left-1 text-2xl font-bold text-indigo-500'>C</span>
          </div>
        </>
      ) : (
        <>
          <Logo className='mb-6 border-b border-b-white/10 px-7 py-3' />
          <button
            type='button'
            onClick={() => setIsCollapsed()}
            className='absolute -right-[17px] top-10 rounded-full border border-white/15 bg-black p-1 transition-colors hover:border-white/30 hover:bg-black'
          >
            <ChevronLeft size={22} className='relative right-px text-neutral-500' />
          </button>
        </>
      )}

      <div
        style={{
          height: 'calc(100% - 80px)' // 80px is the height of the logo with margin
        }}
        className='flex flex-col justify-between gap-0.5 text-sm text-white'
      >
        <AsideNav />

        <SidebarFooter />
      </div>
    </aside>
  )
}
