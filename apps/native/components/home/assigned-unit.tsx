import { Doc } from '@packages/backend/convex/_generated/dataModel'
import { Link } from 'expo-router'
import React from 'react'
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'

type AssignedUnitProps = {
  assignedUnit: {
    unitAssignment: Doc<'condoUnitUsers'>
    unit: Doc<'condoUnits'>
    condo: Doc<'condos'>
  }
}

export default function AssignedUnit({ assignedUnit }: AssignedUnitProps) {
  const { unitAssignment, unit, condo } = assignedUnit

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1 px-4'>
        <View className='py-4'>
          <Text className='mb-4 text-2xl font-bold text-indigo-700'>
            {unit.propertyType === 'apartment' ? 'Apartamento asignado' : 'Casa asignada'} :
          </Text>

          <View className='mb-6 rounded-lg bg-white p-4 shadow-md'>
            <Text className='mb-2 text-lg font-semibold text-indigo-600'>
              Información de la propiedad
            </Text>
            <View className='space-y-2'>
              <Text className='text-gray-700'>
                Número de Unidad: <Text className='font-semibold'>{unit.unitNumber}</Text>
              </Text>
              {unit.buildingNumber && (
                <Text className='text-gray-700'>
                  Número de Edificio: <Text className='font-semibold'>{unit.buildingNumber}</Text>
                </Text>
              )}
              <Text className='text-gray-700'>
                Tipo de Propiedad:{' '}
                <Text className='font-semibold'>
                  {unit.propertyType === 'apartment' ? 'Apartamento' : 'Casa'}
                </Text>
              </Text>
              {unit.area && (
                <Text className='text-gray-700'>
                  Área: <Text className='font-semibold'>{unit.area} m²</Text>
                </Text>
              )}
              {unit.phone && (
                <Text className='text-gray-700'>
                  Teléfono: <Text className='font-semibold'>{unit.phone}</Text>
                </Text>
              )}
              <Text className='text-gray-700'>
                Rol:{' '}
                <Text className='font-semibold'>
                  {unitAssignment.isOwner ? 'Propietario' : 'Inquilino'}
                </Text>
              </Text>
            </View>
          </View>

          <View className='rounded-lg bg-white p-4 shadow-md'>
            <Text className='mb-2 text-lg font-semibold text-indigo-600'>
              Información del Condominio
            </Text>
            <View className='space-y-2'>
              <Text className='text-gray-700'>
                Nombre: <Text className='font-semibold'>{condo.name}</Text>
              </Text>
              <Text className='text-gray-700'>
                Dirección: <Text className='font-semibold'>{condo.address}</Text>
              </Text>
              <Text className='text-gray-700'>
                Ciudad: <Text className='font-semibold'>{condo.city}</Text>
              </Text>
              <Text className='text-gray-700'>
                Estado: <Text className='font-semibold'>{condo.state}</Text>
              </Text>
              <Text className='text-gray-700'>
                País: <Text className='font-semibold'>{condo.country}</Text>
              </Text>
              <Text className='text-gray-700'>
                Código Postal: <Text className='font-semibold'>{condo.zipCode}</Text>
              </Text>
            </View>
          </View>

          <Link href='/(tabs-areas)/areas' asChild>
            <TouchableOpacity className='mt-10 rounded-md bg-indigo-500 p-4'>
              <Text className='text-center text-lg font-semibold text-white'>
                Reservar áreas comunes
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
