import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/dist/react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'

export default function SignupScreen() {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = () => {
    if (password !== confirmPassword) {
      // You might want to show an error message to the user here
      Toast.show({
        type: 'error',
        text1: 'Las contraseñas no coinciden',
        position: 'bottom'
      })
      return
    }

    try {
      void signIn('password', { email, password, flow: 'signUp' })
      router.replace('/(tabs)/')
    } catch (error) {
      console.error('Sign-up failed:', error)
    }
  }

  return (
    <View className='flex-1 items-center justify-center bg-white p-6 dark:bg-gray-900'>
      <Text className='mb-6 text-3xl font-bold text-gray-800 dark:text-white'>
        Piedra Papel ó Tijeras
      </Text>
      <TextInput
        className='mb-3 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 focus:border-indigo-500'
        placeholder='Correo'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        className='mb-3 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 focus:border-indigo-500'
        placeholder='Contraseña'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        className='mb-6 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 focus:border-indigo-500'
        placeholder='Confirmar contraseña'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className='mb-3 w-full rounded-lg bg-indigo-500 px-4 py-3'
        onPress={handleSignup}
      >
        <Text className='text-center font-bold text-white'>Registrarse</Text>
      </TouchableOpacity>
      <Link href='/' asChild>
        <TouchableOpacity>
          <Text className='mt-5 font-bold text-indigo-500'>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
