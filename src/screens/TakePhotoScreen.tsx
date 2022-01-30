import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, requestCameraPermissionsAsync } from 'expo-camera'
import { defaultStyles } from '../styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../../App'
import { uuid } from '../uuid'

type Props = NativeStackScreenProps<StackParamList, 'Take photo'>

export const TakePhotoScreen = memo(({ route, navigation }: Props) => {
  const { id } = route.params

  const camera = useRef<Camera | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(Camera.Constants.Type.back)

  useEffect(() => {
    ;(async () => {
      console.debug('asking for permission to use camera')
      const { status } = await requestCameraPermissionsAsync()
      console.debug('camera permission', status)
      setHasPermission(status === 'granted')
    })()
  }, [setHasPermission])

  const handleToggleCamera = useCallback(
    () =>
      setType(type => (type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)),
    [setType]
  )

  const handleBack = useCallback(() => navigation.goBack(), [navigation])

  const handleTakePhoto = useCallback(async () => {
    const pic = await camera.current?.takePictureAsync()
    console.debug('took photo', pic)
    if (!pic) {
      navigation.navigate('Marker', { id })
      return
    }

    const { uri, width, height } = pic
    navigation.navigate('Marker', { id, image: { id: uuid(), uri, width, height } })
  }, [id, navigation])

  if (hasPermission === null || !hasPermission) {
    console.debug('no permission to use camera')
    return <Text style={defaultStyles.buttonText}>No permission to use camera</Text>
  }

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={styles.camera} type={type} />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={defaultStyles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleCameraButton} onPress={handleToggleCamera}>
          <Text style={defaultStyles.buttonText}>Toggle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.takePhotoButton} onPress={handleTakePhoto}>
          <Text style={defaultStyles.buttonText}>Take photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  camera: {
    width: '100%',
    aspectRatio: 1
  },
  buttons: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  takePhotoButton: {
    ...defaultStyles.button,
    backgroundColor: '#24b60c'
  },
  toggleCameraButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  },
  backButton: {
    ...defaultStyles.button,
    backgroundColor: '#ff0c21'
  }
})
