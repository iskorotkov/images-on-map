import { memo } from 'react'
import { Image, StyleSheet, View } from 'react-native'

// noinspection JSUnusedLocalSymbols
export const Gallery = memo(({ images }: { images: string[] }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: '' }} />
      <Image style={styles.image} source={{ uri: '' }} />
      <Image style={styles.image} source={{ uri: '' }} />
      <Image style={styles.image} source={{ uri: '' }} />
      <Image style={styles.image} source={{ uri: '' }} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  image: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#aaa',
    width: 200,
    height: 200
  }
})
