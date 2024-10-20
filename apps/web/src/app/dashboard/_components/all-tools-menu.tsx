import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Club, HandCoins, PiggyBank, Rows3, Sheet, Swords } from 'lucide-react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { HoverCardArrow, HoverCardPortal } from '@radix-ui/react-hover-card';

type CustomLinkProps = {
  isCollapsed: boolean;
};

/**
 * Custom Link allows to set a Link or a simple <a> tag with an icon and a label, supports a tooltip for the icon
 * @property {boolean} isCollapsed - The isCollapsed property is a boolean that represents the state of the sidebar.
 *
 */
const AllToolsMenu: React.FC<CustomLinkProps> = ({ isCollapsed }) => {
  const commonClasses = cn(
    'flex w-full items-center gap-2 py-2 transition-all hover:bg-secondary-foreground',
    isCollapsed ? 'pl-3' : 'pl-5'
  );
  const iconClassName = cn(
    'h-auto w-5 text-sm',
    isCollapsed ? 'text-neutral-500' : 'text-neutral-500/80'
  );

  return (
    <div className={commonClasses}>
      <HoverCard openDelay={0}>
        <HoverCardTrigger className='flex w-full gap-2'>
          <Club size={20} className={iconClassName} />
          <span
            className={cn(
              'transition-opacity',
              isCollapsed ? 'hidden opacity-0' : 'opacity-100'
            )}
          >
            All tools
          </span>
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent
            side='right'
            className='rounded-none border-none bg-secondary p-0 text-sm'
            sideOffset={-2}
          >
            <HoverCardArrow className='border-none fill-secondary' />

            <Link
              href='/'
              className='flex gap-2 px-5 py-3 text-white transition-colors hover:bg-secondary-foreground'
            >
              <Rows3 size={20} className='text-white/80' />
              All tools
            </Link>
            <Link
              href='/'
              className='flex gap-2 px-5 py-3 text-white transition-colors hover:bg-secondary-foreground'
            >
              <Sheet size={20} className='text-white/80' />
              Strategy charts
            </Link>
            <Link
              href='/'
              className='flex gap-2 px-5 py-3 text-white transition-colors hover:bg-secondary-foreground'
            >
              <Swords size={20} className='text-white/80' />
              Training suite
            </Link>
            <Link
              href='/'
              className='flex gap-2 px-5 py-3 text-white transition-colors hover:bg-secondary-foreground'
            >
              <HandCoins size={20} className='text-white/80' />
              Edge calculator
            </Link>
            <Link
              href='/'
              className='flex gap-2 px-5 py-3 text-white transition-colors hover:bg-secondary-foreground'
            >
              <PiggyBank size={20} className='text-white/80' />
              Bankroll App
            </Link>
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>
    </div>
  );
};

export default AllToolsMenu;
