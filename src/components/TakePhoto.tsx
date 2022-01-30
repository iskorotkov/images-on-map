import { memo, useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, requestCameraPermissionsAsync } from 'expo-camera'
import { defaultStyles } from '../styles'

export const TakePhoto = memo(() => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(Camera.Constants.Type.back)

  const requestPermission = useCallback(async () => {
    console.debug('asking for permission to use camera')
    const { status } = await requestCameraPermissionsAsync()
    console.debug('camera permission', status)
    setHasPermission(status === 'granted')
  }, [setHasPermission])

  const handleToggleCamera = useCallback(
    () =>
      setType(type => (type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)),
    [setType]
  )

  const handleCameraReady = useCallback(() => {
    console.debug('camera ready')
  }, [])

  if (hasPermission === null) {
    return (
      <View>
        <TouchableOpacity onPress={requestPermission} style={styles.requestPermissionButton}>
          <Text style={defaultStyles.buttonText}>Take photo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!hasPermission) {
    console.debug('no permission to use camera')
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} onCameraReady={handleCameraReady} />

      <TouchableOpacity style={styles.toggleCameraButton} onPress={handleToggleCamera}>
        <Text style={defaultStyles.buttonText}>Toggle camera</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {},
  camera: {
    width: 200,
    height: 200
  },
  toggleCameraButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  },
  requestPermissionButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  }
})
