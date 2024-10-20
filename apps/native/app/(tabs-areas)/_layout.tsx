import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { useConvexAuth } from 'convex/react'

import { indigoColor } from '@/constants/Colors'
import { ActivityIndicator, Text, View } from 'react-native'
import { TabBarIcon } from '@/components/navigation/TabBarIcon'

export default function TabAreasLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth()

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

  if (!isAuthenticated) {
    return <Redirect href='/login' />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: indigoColor,
        headerShown: false
      }}
    >
      <Tabs.Screen
        name='areas'
        options={{
          title: 'Áreas comunes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name='reservations'
        options={{
          title: 'Reservas',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Configuración',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          )
        }}
      />
    </Tabs>
  )
}
