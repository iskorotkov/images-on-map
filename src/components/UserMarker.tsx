import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { Coords } from 'google-map-react'

// noinspection JSUnusedLocalSymbols
export const UserMarker = memo(({ lat, lng }: Coords) => {
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
    backgroundColor: '#f55',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }]
  },
  text: {
    color: '#fff'
  }
})
