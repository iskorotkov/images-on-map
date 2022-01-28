import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'

// noinspection JSUnusedLocalSymbols
export const LocationMarker = memo(({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 100,
    padding: 10,
    backgroundColor: '#ff5555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }]
  },
  text: {
    color: '#fff'
  }
})
