'use client';

import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Sheet } from 'lucide-react';
import { HeaderNavHotkeys } from './header-nav-hotkeys';

export function HeaderNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className='border-none bg-secondary'>
          <NavigationMenuTrigger className='bg-transparent hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary'>
            What's new?
          </NavigationMenuTrigger>
          <NavigationMenuContent className='bg-zinc-100'>
            <div className='grid w-[24rem] grid-flow-row grid-cols-2  bg-zinc-100 p-4'>
              <NavigationMenuLink asChild>
                <Link
                  className='flex h-auto w-40 select-none flex-col justify-end rounded-md bg-white p-3 no-underline shadow outline-none transition-shadow hover:shadow-black/30 focus:shadow-md'
                  href='/'
                >
                  <div className='pb-2'>
                    <Sheet size={28} />
                  </div>
                  <div className='mb-2 text-lg font-medium'>
                    Strategy charts
                  </div>
                  <p className='text-sm leading-tight text-muted-foreground'>
                    Now with tooltip explanations, a new design and more!
                  </p>
                </Link>
              </NavigationMenuLink>
              <div className='flex h-full flex-grow flex-col gap-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='flex h-1/2 select-none flex-col justify-end rounded-md bg-white p-3 no-underline shadow outline-none transition-shadow hover:shadow-black/30 focus:shadow-md'
                    href='/'
                  >
                    <div className='mb-2 font-medium'>Casino 411</div>
                    <p className='text-sm leading-tight text-muted-foreground'>
                      New listing layout.
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className='flex h-1/2 select-none flex-col justify-end rounded-md bg-white p-3 no-underline shadow outline-none transition-shadow hover:shadow-black/30 focus:shadow-md'
                    href='/'
                  >
                    <div className='mb-2 font-medium '>
                      Pro Betting Software
                    </div>
                    <p className='text-sm leading-tight text-muted-foreground'>
                      A fresh update!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Shortcuts */}
        <HeaderNavHotkeys />
        <NavigationMenuIndicator className='' />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
