import clsx from 'clsx'
import { useMutation, useQuery } from 'convex/react'
import Toast from 'react-native-toast-message'
import { Controller, useForm } from 'react-hook-form'
import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { indigoColor, lightIndigoColor } from '@/constants/Colors'
import { api } from '@packages/backend/convex/_generated/api'
import { Doc } from '@packages/backend/convex/_generated/dataModel'

type FormData = {
  uniqueCode: string
  unitNumber: string
  buildingNumber: string
  phone: string
  withWhatsapp: boolean
  isOwner: boolean
  idn: string
  propertyRegistration: string
}

export const RequestUnit = ({
  showRequestUnit,
  setShowRequestUnit
}: {
  showRequestUnit: boolean
  setShowRequestUnit: (showRequestUnit: boolean) => void
}) => {
  const user = useQuery(api.users.currentUser)
  const createCondoApplication = useMutation(api.users.createCondoApplication)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      buildingNumber: '',
      idn: '',
      isOwner: false,
      phone: '',
      propertyRegistration: '',
      uniqueCode: '',
      unitNumber: '',
      withWhatsapp: false
    }
  })

  const handleDetailsSubmit = async (data: FormData) => {
    const formData = {
      ...data
    }
    const result = await createCondoApplication({
      ...formData,
      name: user?.name || ''
    })
    if (result?.error) {
      Toast.show({
        type: 'error',
        text1: result.error,
        position: 'bottom',
        text1Style: {
          fontSize: 17,
          fontWeight: 'bold'
        }
      })
    }
  }

  return (
    <View className='w-full'>
      <Text className='mb-2 text-2xl font-bold'>Bienvenido {user?.name}!</Text>
      <Text className='mb-5 text-lg font-semibold'>Por favor, proporciona más detalles:</Text>

      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={clsx(
              'w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500',
              errors.uniqueCode ? 'mb-2 border-red-500' : 'mb-4'
            )}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Código de la urbanización'
            placeholderTextColor='#777'
          />
        )}
        name='uniqueCode'
      />
      {errors.uniqueCode && <Text className='mb-4 text-red-500'>El código es requerido</Text>}

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={clsx(
              'w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500',
              errors.unitNumber ? 'mb-2 border-red-500' : 'mb-4'
            )}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Número de apartamento'
            placeholderTextColor='#777'
            keyboardType='numeric'
          />
        )}
        name='unitNumber'
      />
      {errors.unitNumber && (
        <Text className='mb-4 text-red-500'>El número de apartamento es requerido</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={clsx(
              'mb-4 w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500',
              errors.buildingNumber ? 'mb-2 border-red-500' : 'mb-4'
            )}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Número de edificio (Si es necesario)'
            placeholderTextColor='#777'
          />
        )}
        name='buildingNumber'
      />

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={clsx(
              'w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500',
              errors.phone ? 'mb-2 border-red-500' : 'mb-4'
            )}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Número de teléfono'
            keyboardType='phone-pad'
            placeholderTextColor='#777'
          />
        )}
        name='phone'
      />
      {errors.phone && (
        <Text className='mb-4 text-red-500'>El número de télefono es requerido</Text>
      )}

      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#D1D5DB', true: lightIndigoColor }}
              thumbColor={value ? indigoColor : '#F3F4F6'}
            />
            <Text className='ml-2'>Podemos contactar contigo por WhatsApp</Text>
          </View>
        )}
        name='withWhatsapp'
      />

      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20
            }}
          >
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#D1D5DB', true: lightIndigoColor }}
              thumbColor={value ? indigoColor : '#F3F4F6'}
            />
            <Text className='ml-2'>Soy el propietario</Text>
          </View>
        )}
        name='isOwner'
      />

      {watch('isOwner') && (
        <>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='mb-4 w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder='Número de identificación'
                placeholderTextColor='#777'
              />
            )}
            name='idn'
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='mb-4 w-full rounded-md border border-gray-300 p-4 focus:border-indigo-500'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder='Matrícula inmobiliaria'
                placeholderTextColor='#777'
              />
            )}
            name='propertyRegistration'
          />
        </>
      )}

      <TouchableOpacity
        className='mt-10 rounded bg-indigo-500 px-4 py-4'
        onPress={handleSubmit(handleDetailsSubmit)}
      >
        <Text className='text-center font-bold text-white'>Guardar</Text>
      </TouchableOpacity>

      {showRequestUnit && (
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: indigoColor
          }}
          className='mt-10 rounded border border-indigo-500 px-4 py-4'
          onPress={() => setShowRequestUnit(false)}
        >
          <Text className='text-center font-bold text-indigo-500'>Ver mis solicitudes</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
