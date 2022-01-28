import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker'
import { memo, useCallback, useEffect, useState } from 'react'
import GoogleMapReact, { ChangeEventValue, ClickEventValue, Coords } from 'google-map-react'
import Geolocation from '@react-native-community/geolocation'
import Constants from 'expo-constants'
import { UserMarker } from '../components/UserMarker'
import { ImagesMarker } from '../components/ImagesMarker'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../../App'

const moscowLocation = { lat: 55.74, lng: 37.62 }

type Props = NativeStackScreenProps<StackParamList, 'Map'>

export const MapScreen = memo(({ navigation }: Props) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [imagesMarkers, setImagesMarkers] = useState<Coords[]>([])

  // Google Maps API.
  const [apiLoaded, setApiLoaded] = useState(false)
  const [mapCenter, setMapCenter] = useState(moscowLocation)
  const [mapZoom, setMapZoom] = useState(8)

  const openImagePickerAsync = useCallback(async () => {
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

  useEffect(() => {
    if (!apiLoaded) {
      return
    }

    Geolocation.getCurrentPosition(
      position => {
        console.debug('got geolocation', position.coords)
        const { latitude, longitude } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        setUserLocation(newLocation)
        setMapCenter(newLocation)
        setMapZoom(13)
      },
      error => {
        console.error(error)
        alert('Permission to access geolocation is required')
      }
    )
  }, [apiLoaded, setUserLocation, setMapCenter, setMapZoom])

  const handleChange = useCallback(
    (value: ChangeEventValue) => {
      console.debug('changed map location', value)
      setMapCenter(value.center)
      setMapZoom(value.zoom)
    },
    [setMapCenter, setMapZoom]
  )

  const handleGoogleApiLoaded = useCallback(() => {
    console.debug('google api loaded')
    setApiLoaded(true)
  }, [setApiLoaded])

  const handleClick = useCallback(
    (value: ClickEventValue) => {
      setImagesMarkers(imagesMarkers => [...imagesMarkers, { lat: value.lat, lng: value.lng }])
    },
    [setImagesMarkers]
  )

  const handleChildClick = useCallback(
    (hoverKey: any, childProps: Coords) => {
      navigation.push('Marker', {
        coords: {
          lat: childProps.lat,
          lng: childProps.lng
        }
      })
    },
    [navigation]
  )

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <GoogleMapReact
          zoom={mapZoom}
          center={mapCenter}
          onChange={handleChange}
          onClick={handleClick}
          onChildClick={handleChildClick}
          onGoogleApiLoaded={handleGoogleApiLoaded}
          yesIWantToUseGoogleMapApiInternals={true}
          bootstrapURLKeys={{ key: Constants.manifest?.extra?.googleMapApiKey }}
        >
          {userLocation ? <UserMarker {...userLocation} /> : null}

          {imagesMarkers.map((marker, index) => (
            <ImagesMarker key={index} {...marker} />
          ))}
        </GoogleMapReact>
      </View>

      {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.thumbnail} /> : null}

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    backgroundColor: '#0b82e7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50
  },
  buttonText: {
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300
  },
  map: {
    width: '100%',
    height: '60%'
  }
})
