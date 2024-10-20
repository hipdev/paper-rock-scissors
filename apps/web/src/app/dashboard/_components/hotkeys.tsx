'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { useSidebarStore } from './sidebar-store'
import { useRouter, useParams } from 'next/navigation'

export function Hotkeys() {
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed)
  const { push } = useRouter()
  const params = useParams()

  // Extraer condoId de la URL
  const condoId = params.condoId

  // Función para navegar solo si condoId existe
  const navigateIfCondoExists = (path: string, isProfile: boolean = false) => {
    if (condoId) {
      push(`/dashboard/${condoId}/${path}`)

      if (isProfile) {
        push(`/dashboard/${path}/${condoId}`)
      }
    }
  }

  useHotkeys('ctrl+m', () => setIsCollapsed())
  useHotkeys('shift+1', () => navigateIfCondoExists('reservations'))
  useHotkeys('shift+2', () => navigateIfCondoExists('users'))
  useHotkeys('shift+3', () => navigateIfCondoExists('user-requests'))
  useHotkeys('shift+4', () => navigateIfCondoExists('properties'))
  useHotkeys('shift+5', () => navigateIfCondoExists('common-areas'))
  useHotkeys('shift+6', () => navigateIfCondoExists('condos', true))

  return null
}
