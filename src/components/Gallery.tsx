import { memo } from 'react'
import { Image as ImageComponent, StyleSheet, Text, View } from 'react-native'
import { Image } from '../models/image'

export const Gallery = memo(({ images }: { images: Image[] }) => {
  if (images.length === 0) {
    return <Text style={styles.text}>Attach images to view them here</Text>
  }

  return (
    <View style={styles.container}>
      {images.map(({ id, uri }) => (
        <ImageComponent key={id} style={styles.image} source={{ uri }} />
      ))}
    </View>
  )
})

// TODO: Always show 3-5 images in each row.
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  text: {
    marginHorizontal: 'auto',
    marginVertical: 2,
    textAlign: 'center'
  },
  image: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#aaa',
    width: 100,
    height: 100
  }
})
