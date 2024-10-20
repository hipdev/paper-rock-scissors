'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'

import { useRouter } from 'next/navigation'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginPage() {
  const { signIn } = useAuthActions()
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)

  return (
    <div className='flex min-h-screen items-center justify-center bg-black p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-white'>Iniciar sesión</h2>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitting(true)

            const formData = new FormData(event.currentTarget)
            formData.append('flow', 'signIn')

            signIn('password', formData)
              .then(() => {
                router.push('/dashboard')
              })
              .catch((error) => {
                console.error(error)
                const title = 'Datos incorrectos'
                toast.error(title, {
                  position: 'bottom-center'
                })
                setSubmitting(false)
              })
          }}
        >
          <div className='space-y-4'>
            <div>
              <Label htmlFor='email' className='text-gray-300'>
                Correo
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='mt-1 border-gray-700 bg-gray-800 text-white focus:border-gray-600 focus:ring-gray-600'
              />
            </div>
            <div>
              <Label htmlFor='password' className='text-gray-300'>
                Contraseña
              </Label>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='mt-1 border-gray-700 bg-gray-800 text-white focus:border-gray-600 focus:ring-gray-600'
              />
            </div>
          </div>

          {/* {error && <p className="text-red-400 text-sm">{error}</p>} */}

          <Button
            type='submit'
            className='w-full bg-white font-semibold text-gray-900 hover:bg-gray-200'
          >
            Entrar
          </Button>
        </form>
        <div className='text-center'>
          <p className='text-sm text-gray-400'>
            ¿No tienes una cuenta?{' '}
            <Link href='/signup' className='font-medium text-white hover:text-gray-200'>
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
