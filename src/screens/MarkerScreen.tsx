import { memo, useCallback, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { StackParamList } from '../../App'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Gallery } from '../components/Gallery'
import { defaultStyles } from '../styles'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addImage, renameMarker, selectMarkerById } from '../store/markersReducer'
import { SelectImage } from '../components/SelectImage'
import { Image } from '../models/image'

type Props = NativeStackScreenProps<StackParamList, 'Marker'>

export const MarkerScreen = memo(({ route, navigation }: Props) => {
  const { id, image } = route.params

  const marker = useAppSelector(selectMarkerById(id))
  const { name, location, images } = marker
  const dispatch = useAppDispatch()

  const handleChangeText = useCallback((name: string) => dispatch(renameMarker({ id, name })), [dispatch, id])

  const handlePress = useCallback(() => navigation.goBack(), [navigation])

  const handleOpenCamera = useCallback(() => {
    navigation.navigate('Take photo', { id })
  }, [id, navigation])

  const handleImageSelected = useCallback(
    (image: Image) => {
      dispatch(addImage({ id, image }))
    },
    [dispatch, id]
  )

  useEffect(() => {
    if (image) {
      dispatch(addImage({ id, image: image }))
      navigation.navigate('Marker', { id })
    }
  }, [dispatch, id, image, navigation])

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput style={styles.nameInput} placeholder='Marker name' value={name} onChangeText={handleChangeText} />

        <Text style={styles.location}>
          Location: ({location.latitude}, {location.longitude})
        </Text>

        <SelectImage onSelected={handleImageSelected} />

        <TouchableOpacity style={styles.toggleCameraButton} onPress={handleOpenCamera}>
          <Text style={defaultStyles.buttonText}>Take photo</Text>
        </TouchableOpacity>

        <Gallery images={images} />

        <View style={styles.buttons}>
          <TouchableHighlight style={styles.backButton} onPress={handlePress}>
            <Text style={defaultStyles.buttonText}>Back</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.removeButton} onPress={() => {}}>
            <Text style={defaultStyles.buttonText}>Remove</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.updateButton} onPress={() => {}}>
            <Text style={defaultStyles.buttonText}>Update</Text>
          </TouchableHighlight>
        </View>
      </View>
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    marginVertical: 10,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    maxWidth: 768
  },
  nameInput: {
    padding: 5,
    margin: 10,
    width: '100%',
    minWidth: 50,
    maxWidth: 600,
    borderColor: '#cecece',
    backgroundColor: '#ececec',
    borderWidth: 2,
    borderRadius: 5
  },
  location: {
    margin: 10
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  toggleCameraButton: {
    ...defaultStyles.button,
    backgroundColor: '#0b82e7'
  },
  backButton: {
    ...defaultStyles.button,
    backgroundColor: '#1b96ff'
  },
  removeButton: {
    ...defaultStyles.button,
    backgroundColor: '#ff5050'
  },
  updateButton: {
    ...defaultStyles.button,
    backgroundColor: '#209d1b'
  }
})
