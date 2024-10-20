import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Toast from 'react-native-toast-message'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform
} from 'react-native'
import { useQuery, useMutation } from 'convex/react'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import DateTimePicker from '@react-native-community/datetimepicker'

import { api } from '@packages/backend/convex/_generated/api'
import { ConvexError } from 'convex/values'

export default function AreasScreen() {
  const user = useQuery(api.users.currentUser)
  const assignedUnit = useQuery(api.users.getUserAssignedUnit)
  const [selectedArea, setSelectedArea] = useState<any>(null)
  const [numberOfPeople, setNumberOfPeople] = useState('')
  const [reservationDate, setReservationDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const createReservation = useMutation(api.reservations.createReservation)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ['25%', '50%', '65%'], [])

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleOpenPress = useCallback((area: any) => {
    setSelectedArea(area)
    bottomSheetRef.current?.expand()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  if (!user || !assignedUnit) {
    return <Text>Cargando...</Text>
  }

  const commonAreas = useQuery(api.condos.getCommonAreas, { condoId: assignedUnit.condo._id })

  if (!commonAreas) {
    return <Text>Cargando áreas comunes...</Text>
  }

  const getIconForAreaType = (type: string) => {
    switch (type) {
      case 'gym':
        return '🏋️'
      case 'pool':
        return '🏊'
      case 'sauna':
        return '🧖'
      case 'steamRoom':
        return '🚿'
      case 'soccerField':
        return '⚽'
      case 'socialRoom':
        return '🎉'
      default:
        return '🏠'
    }
  }

  const handleReservation = async () => {
    if (!selectedArea || !numberOfPeople || !reservationDate) {
      Toast.show({
        type: 'error',
        text1: 'Por favor, complete todos los campos'
      })
      return
    }

    const now = new Date()
    const minDate = new Date(now.getTime() + 60 * 60 * 1000) // Mínimo una hora en el futuro
    const maxDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Máximo un día en el futuro

    if (reservationDate < minDate) {
      Toast.show({
        type: 'error',
        text1: 'La reserva debe ser al menos una hora en el futuro'
      })
      return
    }

    if (reservationDate > maxDate) {
      Toast.show({
        type: 'error',
        text1: 'La fecha de reserva no puede ser mayor a un día a partir de ahora'
      })
      return
    }

    try {
      await createReservation({
        condoId: assignedUnit.condo._id,
        commonAreaId: selectedArea._id,
        condoUnitId: assignedUnit.unit._id,
        numberOfPeople: parseInt(numberOfPeople),
        reservationTime: reservationDate.getTime() // Enviar como UTC timestamp
      })
      Toast.show({
        type: 'success',
        text1: 'Reserva creada con éxito'
      })
      handleClosePress()
      setSelectedArea(null)
      setNumberOfPeople('')
      setReservationDate(new Date())
    } catch (error) {
      const errorMessage = error instanceof ConvexError ? error.data : 'Ocurrió un error'

      Toast.show({
        type: 'error',
        text1: errorMessage
      })
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || reservationDate
    setShowDatePicker(Platform.OS === 'ios')
    setReservationDate(currentDate)
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='flex-1 bg-gray-100'>
        <ScrollView className='flex-1 px-4 py-6'>
          <Text className='mb-6 text-2xl font-bold text-indigo-700'>Áreas Comunes</Text>
          <View className='flex-row flex-wrap justify-between'>
            {commonAreas.map((area) => (
              <TouchableOpacity
                key={area._id}
                className='mb-4 w-[48%] overflow-hidden rounded-lg bg-white p-4 shadow-md'
                style={{ elevation: 3 }}
                onPress={() => handleOpenPress(area)}
              >
                <View className='mb-2 items-center justify-center rounded-full bg-indigo-100 p-3'>
                  <Text className='text-3xl'>{getIconForAreaType(area.type)}</Text>
                </View>
                <Text className='mb-1 text-center text-lg font-semibold text-indigo-700'>
                  {area.name}
                </Text>
                <Text className='text-center text-gray-600'>Capacidad: {area.maxCapacity}</Text>
                <Text className='text-center text-gray-600'>
                  Disponible: {area.isAvailable ? 'Sí' : 'No'}
                </Text>
                <Text className='text-center text-gray-600'>
                  Cupos disponibles: {area.remainingCapacity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
        >
          <View className='flex-1 px-4'>
            <ScrollView>
              <Text className='mb-4 text-xl font-bold text-indigo-700'>{selectedArea?.name}</Text>
              <Text className='mb-2 text-gray-600'>
                Cupos disponibles: {selectedArea?.remainingCapacity}
              </Text>
              <TextInput
                className='mb-4 rounded-md border border-gray-300 p-4'
                placeholder='Número de personas'
                keyboardType='numeric'
                value={numberOfPeople}
                placeholderTextColor='#777'
                onChangeText={setNumberOfPeople}
              />
              <TouchableOpacity
                className='mb-4 rounded-md border border-gray-300 p-4'
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{reservationDate.toLocaleString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID='dateTimePicker'
                  value={reservationDate}
                  mode='datetime'
                  display='default'
                  onChange={onDateChange}
                  className='mb-5'
                  maximumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                />
              )}
              <TouchableOpacity
                className='mt-5 rounded-md bg-indigo-600 p-4'
                onPress={handleReservation}
              >
                <Text className='text-center text-white'>Reservar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='mt-4 rounded-md bg-gray-300 p-3'
                onPress={handleClosePress}
              >
                <Text className='text-center'>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
