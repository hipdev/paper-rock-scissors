'use client'

import DropdownUser from './dropdown-user'
import SidebarHotkeys from './sidebar-hotkeys'

export default function SidebarFooter() {
  return (
    <div>
      <SidebarHotkeys />

      <DropdownUser />
    </div>
  )
}
