import { memo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export const Gallery = memo(({ images }: { images: string[] }) => {
  if (images.length === 0) {
    return <Text style={styles.text}>Attach images to view them here</Text>
  }

  return (
    <View style={styles.container}>
      {images.map(uri => (
        <Image style={styles.image} source={{ uri }} />
      ))}
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
  text: {
    marginHorizontal: 'auto',
    marginVertical: 2,
    textAlign: 'center'
  },
  image: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#aaa',
    width: 200,
    height: 200
  }
})
