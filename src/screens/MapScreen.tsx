import { StyleSheet, View } from 'react-native'
import { memo, useCallback, useEffect, useState } from 'react'
import GoogleMapReact, { ChangeEventValue, ClickEventValue } from 'google-map-react'
import Geolocation from '@react-native-community/geolocation'
import Constants from 'expo-constants'
import { UserMarker } from '../components/UserMarker'
import { ImageMarkerProps, ImagesMarker } from '../components/ImagesMarker'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../../App'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMarker, selectMarkers } from '../store/markersReducer'
import { v4 } from 'uuid'

const moscowLocation = { lat: 55.74, lng: 37.62 }

type Props = NativeStackScreenProps<StackParamList, 'Map'>

export const MapScreen = memo(({ navigation }: Props) => {
  const markers = useAppSelector(selectMarkers)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Google Maps API.
  const [apiLoaded, setApiLoaded] = useState(false)
  const [mapCenter, setMapCenter] = useState(moscowLocation)
  const [mapZoom, setMapZoom] = useState(8)

  const dispatch = useAppDispatch()

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
      dispatch(
        addMarker({
          id: v4(),
          name: 'New marker',
          location: { lat: value.lat, lng: value.lng },
          images: []
        })
      )
    },
    [dispatch]
  )

  const handleChildClick = useCallback(
    (hoverKey: any, childProps: ImageMarkerProps) => {
      console.log('selected marker with props', childProps)

      if (!childProps.id) {
        console.error('marker id property not set on component')
        return
      }
      navigation.push('Marker', { id: childProps.id })
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

          {markers.map(marker => (
            <ImagesMarker key={marker.id} id={marker.id} {...marker.location} />
          ))}
        </GoogleMapReact>
      </View>
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
  thumbnail: {
    width: 300,
    height: 300
  },
  map: {
    width: '100%',
    height: '100%'
  }
})
