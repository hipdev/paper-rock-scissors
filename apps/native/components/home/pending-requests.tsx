import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native'

import { Doc } from '@packages/backend/convex/_generated/dataModel'
import clsx from 'clsx'

export const statusValues = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado'
}

const PendingRequestsScreen = ({
  requests,
  onNewRequest
}: {
  requests: Doc<'condoTemporalUnitUsers'>[]
  onNewRequest: () => void
}) => {
  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1 px-4'>
        <View className='flex flex-1 flex-col justify-between px-4 py-6'>
          <Text className='mb-6 pl-4 text-2xl font-bold'>Solicitudes Pendientes</Text>

          <View className='mt-5 bg-black'>
            {requests.map((request) => (
              <View key={request._id} className='mb-8 rounded-xl bg-white p-6 shadow-md'>
                <Text className='mb-4 text-xl font-semibold text-gray-700'>
                  Información de la Solicitud
                </Text>
                <View className='flex justify-between'>
                  <InfoItem label='Nombre' value={request.name} />
                  <InfoItem label='Unidad' value={request.unitNumber} />
                  <InfoItem label='Edificio' value={request.buildingNumber} />
                  <InfoItem label='Teléfono' value={request.phone} />
                  <InfoItem
                    label='Estado'
                    className={clsx(
                      request?.status === 'pending'
                        ? 'text-yellow-500'
                        : request?.status === 'approved'
                          ? 'text-green-500'
                          : 'text-red-500'
                    )}
                    value={statusValues[request?.status || 'pending']}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className='mb-5 mt-10'>
            <Text className='text-lg text-gray-600'>
              Tu solicitud está en proceso. El administrador del conjunto estará verificando tu
              información. Cuando sea confirmada, podrás acceder a las diferentes opciones de
              reservas.
            </Text>
          </View>

          <TouchableOpacity
            onPress={onNewRequest}
            className='mt-10 rounded-md bg-indigo-500 px-6 py-4 shadow-lg'
          >
            <Text className='text-center text-lg font-semibold text-white'>
              Crear una nueva solicitud
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const InfoItem = ({
  label,
  value,
  className
}: {
  label: string
  value: string
  className?: string
}) => (
  <View style={{ flexDirection: 'row' }} className='mt-4 flex-row items-center justify-between'>
    <Text className='font-medium text-gray-600'>{label}:</Text>
    <Text className={clsx('font-semibold', className)}>{value}</Text>
  </View>
)

export default PendingRequestsScreen
