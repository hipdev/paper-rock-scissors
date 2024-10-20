import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@packages/backend/convex/_generated/api'
import Toast from 'react-native-toast-message'
import { Id } from '@packages/backend/convex/_generated/dataModel'

const reservationStatus = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  inUse: 'En uso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  noShow: 'No show'
}

export default function ReservationsScreen() {
  const reservations = useQuery(api.reservations.getUserReservations)
  const deleteReservation = useMutation(api.reservations.deleteReservation)

  const handleDeleteReservation = (reservationId: Id<'reservations'>) => {
    Alert.alert('Eliminar Reserva', '¿Estás seguro de que quieres eliminar esta reserva?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReservation({ reservationId })
            Toast.show({
              type: 'success',
              text1: 'Reserva eliminada con éxito'
            })
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Error al eliminar la reserva'
            })
          }
        }
      }
    ])
  }

  if (!reservations) {
    return <Text>Cargando reservas...</Text>
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1 px-4 py-6'>
        <Text className='mb-6 text-2xl font-bold text-indigo-700'>Mis Reservas</Text>
        {reservations.length === 0 ? (
          <Text className='text-center text-gray-500'>No tienes reservas activas</Text>
        ) : (
          reservations.map((reservation) => (
            <View key={reservation._id} className='mb-4 rounded-lg bg-white p-4 shadow-md'>
              <Text className='mb-2 text-xl font-semibold text-indigo-700'>
                {reservation.commonArea?.name}
              </Text>
              <Text className='text-gray-600'>
                Fecha: {new Date(reservation.reservationTime).toLocaleString()}
              </Text>
              <Text className='text-gray-600'>Personas: {reservation.numberOfPeople}</Text>
              <Text className='text-gray-600'>Estado: {reservationStatus[reservation.status]}</Text>
              <TouchableOpacity
                className='mt-5 rounded-md bg-red-700 p-2'
                onPress={() => handleDeleteReservation(reservation._id)}
              >
                <Text className='text-center text-white'>Eliminar Reserva</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
