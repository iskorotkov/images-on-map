import { memo, useCallback, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { StackParamList } from '../../App'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Gallery } from '../components/Gallery'
import { defaultStyles } from '../styles'

type Props = NativeStackScreenProps<StackParamList, 'Marker'>

export const MarkerScreen = memo(({ route, navigation }: Props) => {
  const coords = route.params.coords

  const [markerName, setMarkerName] = useState('New marker')

  const handleChangeText = useCallback((value: string) => setMarkerName(value), [setMarkerName])

  const handlePress = useCallback(() => navigation.goBack(), [navigation])

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder='Marker name'
        value={markerName}
        onChangeText={handleChangeText}
      />

      <Text style={styles.location}>
        Location: ({coords.lat}, {coords.lng})
      </Text>

      <View style={styles.gallery}>
        <Gallery />
      </View>

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
    maxWidth: 600,
    borderColor: '#cecece',
    backgroundColor: '#ececec',
    borderWidth: 2,
    borderRadius: 5
  },
  location: {
    margin: 10
  },
  gallery: {
    margin: 10
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
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
