import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  href?: string
  className?: string
}

/**
 * The type `Props` in TypeScript React consists of optional properties `href` and `className`.
 * @property {string} href - The `href` property is a string that represents the URL to which the link
 * will navigate when clicked. It is optional, meaning it is not required for the component to
 * function.
 * @property {string} className - The `className` property is used to specify one or more class names
 * for an HTML element. It allows you to apply CSS styles to the element. In React, you can pass the
 * `className` prop to components to style them using CSS classes.
 */
export default function Logo({ href = '/', className }: Props) {
  return (
    <Link href={href} className={cn('block py-1', className)}>
      <span className='text-xl font-medium text-indigo-500'>PPT</span>
    </Link>
  )
}
