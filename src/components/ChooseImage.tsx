import { memo, useCallback, useState } from 'react'
import { launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { defaultStyles } from '../styles'

export const ChooseImage = memo(() => {
  const [selectedImage, setSelectedImage] = useState('')

  const openImagePicker = useCallback(async () => {
    const permissionResult = await requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access camera is required')
      return
    }

    const pickerResult = await launchImageLibraryAsync()
    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.uri)
    }
  }, [setSelectedImage])

  return (
    <View style={styles.container}>
      {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.thumbnail} /> : null}

      <TouchableOpacity onPress={openImagePicker} style={styles.chooseImageButton}>
        <Text style={defaultStyles.buttonText}>Choose image from gallery</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {},
  thumbnail: {
    width: 200,
    height: 200,
    margin: 'auto'
  },
  chooseImageButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  }
})
