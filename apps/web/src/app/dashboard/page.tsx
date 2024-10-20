'use client'

import { useQuery } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  // if (condos && condos.length <= 0) {
  //   router.push('/dashboard/condos/new-condo')
  // }

  // useEffect(() => {
  //   if (condos && condos.length > 0) {
  //     router.push(`/dashboard/${condos[0]._id}/reservations`)
  //   }
  // }, [condos])

  return (
    <div className='flex h-screen items-center justify-center'>
      <h1 className='animate-pulse text-2xl font-semibold'>Loading...</h1>
    </div>
  )
}
