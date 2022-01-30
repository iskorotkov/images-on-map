import { memo, useCallback } from 'react'
import { launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { defaultStyles } from '../styles'
import { Image } from '../models/image'
import { uuid } from '../uuid'

export const SelectImage = memo(({ onSelected }: { onSelected: (img: Image) => void }) => {
  const openImagePicker = useCallback(async () => {
    const permissionResult = await requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access camera is required')
      return
    }

    const pickerResult = await launchImageLibraryAsync()
    if (!pickerResult.cancelled) {
      const { uri, height, width } = pickerResult
      onSelected({ id: uuid(), uri, width, height })
    }
  }, [onSelected])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePicker} style={styles.chooseImageButton}>
        <Text style={defaultStyles.buttonText}>Choose image from gallery</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  thumbnail: {
    width: 200,
    height: 200
  },
  chooseImageButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  }
})
