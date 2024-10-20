import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Link, Redirect, useRouter } from 'expo-router'
import { useConvexAuth } from 'convex/react'
import { ActivityIndicator } from 'react-native'
import { useAuthActions } from '@convex-dev/auth/dist/react'
import Toast from 'react-native-toast-message'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { isLoading, isAuthenticated } = useConvexAuth()
  const { signIn } = useAuthActions()
  const router = useRouter()
  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white dark:bg-gray-900'>
        <ActivityIndicator size='large' color='#3B82F6' />
        <Text className='mt-4 text-xl font-semibold text-gray-800 dark:text-white'>
          Cargando Piedra Papel ó Tijeras...
        </Text>
      </View>
    )
  }

  if (isAuthenticated) {
    return <Redirect href='/(tabs)/' />
  }

  const handleLogin = async () => {
    try {
      // Intenta iniciar sesión con Convex Auth
      await signIn('password', { email, password, flow: 'signIn' })

      // Si el inicio de sesión es exitoso, redirige al usuario
      router.replace('/(tabs)/')

      Toast.show({
        type: 'success',
        text1: 'Inicio de sesión exitoso',
        position: 'bottom'
      })
    } catch (error) {
      // Si hay un error, muestra un mensaje al usuario
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: error instanceof Error ? error.message : 'Intenta de nuevo',
        position: 'bottom'
      })
    }
  }
  return (
    <View className='flex-1 items-center justify-center bg-white p-6 dark:bg-gray-900'>
      <Text className='mb-6 text-3xl font-bold text-gray-800 dark:text-white'>Entrar a PPT</Text>
      <TextInput
        className='mb-3 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 focus:border-indigo-500'
        placeholder='Correo'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        className='mb-6 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 focus:border-indigo-500'
        placeholder='Contraseña'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className='mb-3 w-full rounded-lg bg-indigo-500 px-4 py-3'
        onPress={handleLogin}
      >
        <Text className='text-center font-bold text-white'>Entrar</Text>
      </TouchableOpacity>
      <Link href='/signup' asChild>
        <TouchableOpacity>
          <Text className='mt-10 font-bold text-indigo-500'>¿No tienes una cuenta? Registrate</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
