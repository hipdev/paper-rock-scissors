'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignupPage() {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== repeatPassword) {
      setError('Passwords do not match')
    } else {
      console.log(email, password)

      const formData = new FormData()
      formData.append('flow', 'signUp')
      formData.append('email', email)
      formData.append('password', password)

      const res = signIn('password', formData)
        .then(() => {
          router.push('/dashboard')
        })
        .catch((error) => {
          console.error(error)
          const title = 'Datos incorrectos'
          toast.error(title, {
            position: 'bottom-center'
          })
          setError('La contraseña debe ser mas fuerte')
        })

      console.log(await res, 'res')
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-black p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-white'>Crear cuenta</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete='new-password'
                required
                className='mt-1 border-gray-700 bg-gray-800 text-white focus:border-gray-600 focus:ring-gray-600'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor='repeat-password' className='text-gray-300'>
                Repetir contraseña
              </Label>
              <Input
                id='repeat-password'
                name='repeat-password'
                type='password'
                autoComplete='new-password'
                required
                className='mt-1 border-gray-700 bg-gray-800 text-white focus:border-gray-600 focus:ring-gray-600'
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className='text-sm text-red-400'>{error}</p>}

          <Button
            type='submit'
            className='w-full bg-white font-semibold text-gray-900 hover:bg-gray-200'
          >
            Registrarse
          </Button>
        </form>

        <div className='flex justify-end gap-2'>
          <p className='text-gray-500'>Ya tienes una cuenta?</p>
          <Link href='/'>
            <span className='font-semibold text-gray-300 hover:underline'>Iniciar sesión</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
