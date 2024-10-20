'use client';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Keyboard } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSidebarStore } from './sidebar-store';
import { useRouter } from 'next/navigation';

export function HeaderNavHotkeys() {
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed);
  const { push } = useRouter();

  useHotkeys('ctrl+m', () => setIsCollapsed());
  useHotkeys('shift+1', () => push('/strategy-charts'));
  useHotkeys('shift+2', () => push('/casino-411'));
  useHotkeys('shift+3', () => push('/pro-betting-software'));

  return (
    <NavigationMenuItem className='border-none bg-secondary'>
      <NavigationMenuTrigger className='gap-2 bg-transparent hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary'>
        <Keyboard size={20} /> Hotkeys
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className=' w-[23.5rem] bg-zinc-100 p-4'>
          <h3 className='text-xl font-semibold'>Hotkeys!</h3>
          <p>We're adding hotkeys for all new pages and features.</p>

          <div>
            <ul className='mt-2 flex flex-col items-start justify-start gap-3 rounded'>
              <li className='flex items-center gap-2 rounded-md bg-white p-2 shadow'>
                <span className='rounded-md bg-primary px-2 py-1 text-xs font-medium text-white'>
                  Ctrl + M
                </span>
                Collapse Menu
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white p-2 shadow'>
                <span className='rounded-md bg-primary px-2 py-1 text-xs font-medium text-white'>
                  Shift + 1
                </span>
                Open Strategy Charts
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white p-2 shadow'>
                <span className='rounded-md bg-primary px-2 py-1 text-xs font-medium text-white'>
                  Shift + 2
                </span>
                Open Casino 411
              </li>
              <li className='flex items-center gap-2 rounded-md bg-white p-2 shadow'>
                <span className='rounded-md bg-primary px-2 py-1 text-xs font-medium text-white'>
                  Shift + 3
                </span>
                Open Pro Betting Software
              </li>
            </ul>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
