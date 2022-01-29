import { memo } from 'react'
import { Coords } from 'google-map-react'
import { StyleSheet, View } from 'react-native'

export type ImageMarkerProps = Coords & { id: string }

// noinspection JSUnusedLocalSymbols
export const ImagesMarker = memo(({ id, lat, lng }: ImageMarkerProps) => {
  return <View style={styles.container}></View>
})

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#338fff',
    transform: [{ translateX: -10 }, { translateY: -10 }]
  }
})
