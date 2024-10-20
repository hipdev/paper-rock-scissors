'use client'

import { cn } from '@/lib/utils'
import { Keyboard, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { useSidebarStore } from './sidebar-store'
import { useState } from 'react'

export default function SidebarHotkeys() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <button
        type='button'
        className={cn(
          'group mb-2 flex w-full items-center justify-between px-5 py-2 text-white transition-colors hover:text-neutral-500',
          isCollapsed && 'px-3'
        )}
        onClick={() => setOpenModal(true)}
      >
        <div className='flex gap-2.5'>
          <Keyboard size={21} className='text-neutral-500' />
          <span className={cn(isCollapsed && 'hidden')}>Atajos</span>
        </div>

        {/* <span
              className={cn(
                'rounded-full bg-[#892F2B] px-2 py-px text-xs font-semibold transition-colors group-hover:bg-[#A63A35] group-hover:text-white',
                isCollapsed && 'hidden'
              )}
            >
              NEW
            </span> */}
      </button>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='max-w-2xl border-white/10 px-8 py-7' aria-describedby={undefined}>
          <DialogTitle className='text-2xl font-bold'>Atajos de teclado</DialogTitle>

          <div>
            <ul className='mt-2 grid grid-cols-2 items-start justify-start gap-3 rounded'>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Ctrl <Plus className='w-3.5' /> M
                </span>
                Ocultar/Mostrar menú
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 1
                </span>
                Reservas
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 2
                </span>
                Usuarios
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 3
                </span>
                Solicitudes
              </li>

              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 4
                </span>
                Propiedades
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 4
                </span>
                Áreas comunes
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-2 shadow'>
                <span className='bg-primary-foreground flex items-center gap-1 rounded-sm px-2 py-0 text-xs font-semibold text-black'>
                  Shift <Plus className='w-3.5' /> 5
                </span>
                Mi perfil
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
