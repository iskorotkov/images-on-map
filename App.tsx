import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker'
import { useCallback, useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import Geolocation from '@react-native-community/geolocation'
import Constants from 'expo-constants'

const moscowLocation = { lat: 55.74, lng: 37.62 }

const App = () => {
  const [apiLoaded, setApiLoaded] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(moscowLocation)
  const [zoom, setZoom] = useState(8)
  const [selectedImage, setSelectedImage] = useState('')

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

  const handleChange = useCallback(
    (value: GoogleMapReact.ChangeEventValue) => {
      console.debug('changed geolocation', value)
      setCurrentLocation(value.center)
      setZoom(value.zoom)
    },
    [setCurrentLocation]
  )

  const handleGoogleApiLoaded = useCallback(() => {
    console.debug('google api loaded')
    setApiLoaded(true)
  }, [])

  useEffect(() => {
    if (!apiLoaded) {
      return
    }

    Geolocation.getCurrentPosition(
      position => {
        console.debug('got geolocation', position.coords)
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })
        setZoom(13)
      },
      error => {
        console.error(error)
        alert('Permission to access geolocation is required')
      }
    )
  }, [apiLoaded, setCurrentLocation])

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <GoogleMapReact
          zoom={zoom}
          center={currentLocation}
          onChange={handleChange}
          onGoogleApiLoaded={handleGoogleApiLoaded}
          yesIWantToUseGoogleMapApiInternals={true}
          bootstrapURLKeys={{ key: Constants.manifest?.extra?.googleMapApiKey }}
        ></GoogleMapReact>
      </View>

      {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.thumbnail} /> : null}

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
    </View>
  )
}

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

// noinspection JSUnusedGlobalSymbols
export default App
