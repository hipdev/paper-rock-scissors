import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch
} from 'react-native'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import { useForm, Controller } from 'react-hook-form'
import { useAuthActions } from '@convex-dev/auth/react'

import Toast from 'react-native-toast-message'
import { indigoColor, lightIndigoColor } from '@/constants/Colors'

type FormData = {
  name: string
  lastName: string
}

export default function SettingsScreen() {
  const user = useQuery(api.users.currentUser)
  const updateUser = useMutation(api.users.updateUser)
  const { signOut } = useAuthActions()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      lastName: user?.lastName || ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateUser(data)
      Toast.show({
        type: 'success',
        text1: 'Perfil actualizado',
        position: 'bottom'
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar el perfil',
        position: 'bottom'
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      Toast.show({
        type: 'success',
        text1: 'Sesión cerrada exitosamente',
        position: 'bottom'
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al cerrar sesión',
        position: 'bottom'
      })
    }
  }

  if (!user) {
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-1 flex-col justify-between'>
        <ScrollView className='flex-1 px-4'>
          <View className='py-6'>
            <Text className='mb-6 text-2xl font-bold'>Configuración</Text>

            <View className='mb-6'>
              <Text className='mb-2 text-lg font-semibold'>Información personal</Text>
              <Controller
                control={control}
                rules={{ required: 'El nombre es requerido' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='mb-4 rounded-md border border-gray-300 p-2'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder='Nombre'
                  />
                )}
                name='name'
              />
              {errors.name && <Text className='mb-2 text-red-500'>{errors.name.message}</Text>}

              <Controller
                control={control}
                rules={{ required: 'El apellido es requerido' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='mb-4 rounded-md border border-gray-300 p-2'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder='Apellido'
                  />
                )}
                name='lastName'
              />
              {errors.lastName && (
                <Text className='mb-2 text-red-500'>{errors.lastName.message}</Text>
              )}

              <TouchableOpacity
                className='rounded bg-indigo-500 px-4 py-2'
                onPress={handleSubmit(onSubmit)}
              >
                <Text className='text-center font-bold text-white'>Actualizar perfil</Text>
              </TouchableOpacity>
            </View>

            <View className='mb-6'>
              <Text className='mb-2 text-lg font-semibold'>Información de vivienda</Text>
              <Text>
                Condominio: {user.condos && user.condos.length > 0 ? 'Asignado' : 'No asignado'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className='mx-4 mb-4'>
          <TouchableOpacity
            className='mt-4 rounded border border-red-500 px-4 py-2'
            onPress={handleSignOut}
          >
            <Text className='text-center font-bold text-red-500'>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
