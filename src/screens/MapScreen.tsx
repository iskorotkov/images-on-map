import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { EventUserLocation, MapEvent, Marker as MapMarker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { StackParamList } from '../../App'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMarker, selectMarkers } from '../store/reducers/markersReducer'
import { uuid } from '../uuid'

type Props = NativeStackScreenProps<StackParamList, 'Map'>

const moscowLocation: Region = { latitude: 55.74, longitude: 37.62, latitudeDelta: 0.09, longitudeDelta: 0.05 }

export const MapScreen = memo(({ navigation }: Props) => {
  const markers = useAppSelector(selectMarkers)
  const dispatch = useAppDispatch()

  const [firstLoad, setFirstLoad] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<Region>(moscowLocation)

  const handleMarkerAdd = useCallback(
    (event: MapEvent) => {
      console.debug('adding marker')
      dispatch(
        addMarker({
          id: uuid(),
          name: 'New marker',
          location: event.nativeEvent.coordinate,
          images: []
        })
      )
    },
    [dispatch]
  )

  const handleMarkerSelect = useCallback(
    (id: string) => {
      console.debug('selected marker with props', id)

      if (!id) {
        console.error('marker id property not set on component')
        return
      }
      navigation.push('Marker', { id })
    },
    [navigation]
  )

  const handleUserLocationChange = useCallback(
    (event: EventUserLocation) => {
      if (firstLoad) {
        console.debug('get user location', JSON.stringify(event.nativeEvent.coordinate))
        const { latitude, longitude } = event.nativeEvent.coordinate
        setFirstLoad(false)
        setSelectedLocation({ ...moscowLocation, latitude, longitude })
      }
    },
    [firstLoad]
  )

  const handleSelectedLocationChange = useCallback(
    (region: Region, { isGesture }) => {
      if (isGesture) {
        setSelectedLocation(region)
      }
    },
    [setSelectedLocation]
  )

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onLongPress={handleMarkerAdd}
        showsUserLocation={true}
        zoomControlEnabled={true}
        onUserLocationChange={handleUserLocationChange}
        onRegionChangeComplete={handleSelectedLocationChange}
        region={selectedLocation}
      >
        {markers.map(_ => (
          <MapMarker
            key={_.id + _.name + _.images.length}
            identifier={_.id}
            title={_.name}
            description={`${_.images.length} image(s)`}
            coordinate={{ longitude: _.location.longitude, latitude: _.location.latitude }}
            onCalloutPress={() => handleMarkerSelect(_.id)}
          />
        ))}
      </MapView>
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
