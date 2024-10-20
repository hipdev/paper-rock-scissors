import React from 'react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

type CustomLinkProps = {
  href?: string;
  isCollapsed: boolean;
  label?: string;
  IconComponent: React.ReactElement;
  className?: string;
  isLink?: boolean;
};

type IconWithTooltipProps = {
  IconComponent: React.ReactElement; // Assuming IconComponent is a react element
  label: string;
  isCollapsed: boolean;
};

// Tooltip wrapper for icon
const IconWithTooltip = ({
  IconComponent,
  label,
  isCollapsed
}: IconWithTooltipProps) => (
  <TooltipProvider delayDuration={0} disableHoverableContent>
    <Tooltip>
      <TooltipTrigger>{IconComponent}</TooltipTrigger>
      {isCollapsed && (
        <TooltipPortal>
          <TooltipContent
            side='right'
            sideOffset={3}
            className='border-none bg-secondary text-white shadow-sm shadow-black'
            forceMount
          >
            <span>{label}</span>
            <TooltipArrow className='border-none fill-secondary' />
          </TooltipContent>
        </TooltipPortal>
      )}
    </Tooltip>
  </TooltipProvider>
);

/**
 * Custom Link allows to set a Link or a simple <a> tag with an icon and a label, supports a tooltip for the icon
 * @property {string} href - The href property is a string that represents the URL of the link.
 * @property {boolean} isCollapsed - The isCollapsed property is a boolean that represents the state of the sidebar.
 * @property {string} label - The label property is a string that represents the text of the link.
 * @property {string} className - The className property is a string that represents the class name of the link.
 * @property {boolean} isLink - The isLink property is a boolean that represents if the link is a simple <a> tag or a Link component.
 * @property {React.ReactElement} IconComponent - The IconComponent property is a React element that represents the icon of the link.
 *
 */
const CustomLink: React.FC<CustomLinkProps> = ({
  href = '/',
  isCollapsed,
  IconComponent,
  label = 'Overview',
  className = '',
  isLink = true
}) => {
  const commonClasses = cn(
    'flex w-full items-center gap-2 py-2.5 transition-all hover:bg-secondary-foreground',
    isCollapsed ? 'pl-3' : 'pl-5',
    className
  );

  const Wrapper = isLink ? Link : 'a';

  return (
    <Wrapper href={href} className={commonClasses}>
      <IconWithTooltip
        IconComponent={IconComponent}
        label={label}
        isCollapsed={isCollapsed}
      />
      <span
        className={cn(
          'transition-opacity',
          isCollapsed ? 'hidden opacity-0' : 'opacity-100'
        )}
      >
        {label}
      </span>
    </Wrapper>
  );
};

export default CustomLink;
