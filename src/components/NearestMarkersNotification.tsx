import { dismissAllNotificationsAsync, scheduleNotificationAsync } from 'expo-notifications'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectMarkers } from '../store/reducers/markersReducer'
import { Coords } from '../models/coords'
import { getCurrentPositionAsync, startLocationUpdatesAsync } from 'expo-location'
import { getDistance } from 'geolib'
import { defineTask, unregisterTaskAsync } from 'expo-task-manager'

export const NearestMarkersNotification = memo(({ distance = 1000 }: { distance?: number }) => {
  const markers = useAppSelector(selectMarkers)

  const [location, setLocation] = useState<Coords | null>(null)

  const closeMarkers = useMemo(() => {
    if (!location) {
      return []
    }

    console.log(
      `distances from ${JSON.stringify(location)} to markers:`,
      JSON.stringify(markers.map(_ => getDistance(_.location, location)))
    )

    return markers.filter(marker => getDistance(marker.location, location) <= distance)
  }, [distance, location, markers])

  useEffect(() => {
    ;(async () => {
      const { coords } = await getCurrentPositionAsync()
      setLocation({
        longitude: coords.longitude,
        latitude: coords.latitude
      })
    })()
  }, [])

  useEffect(() => {
    const taskName = 'background-geolocation'

    ;(async () => {
      await startLocationUpdatesAsync(taskName)

      defineTask(taskName, ({ data, error }) => {
        if (error) {
          console.error(error)
          return
        }

        const locationsResult = data as { locations: { coords: Coords }[] }
        const currentLocation = locationsResult.locations[0].coords

        setLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        })
      })
    })()

    return () => {
      unregisterTaskAsync(taskName)
    }
  }, [])

  useEffect(() => {
    if (!location) {
      return
    }

    ;(async () => {
      await dismissAllNotificationsAsync()

      for (const marker of closeMarkers) {
        const locationStr = `(${marker.location.latitude.toFixed(4)}, ${marker.location.longitude.toFixed(4)})`
        scheduleNotificationAsync({
          content: {
            title: `You are near marker ${marker.name}`,
            body: `${getDistance(marker.location, location)}m | ${marker.images.length} images | ${locationStr}`,
            color: '#44f'
          },
          trigger: {
            seconds: 1
          }
        })
      }
    })()
  }, [closeMarkers, location])

  return <></>
})
