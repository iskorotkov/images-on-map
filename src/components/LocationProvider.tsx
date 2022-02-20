import React, { memo, useEffect, useState } from 'react'
import { requestBackgroundPermissionsAsync } from 'expo-location'

export const LocationProvider = memo(({ children }: { children?: React.ReactNode }) => {
  const [locationEnabled, setLocationEnabled] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await requestBackgroundPermissionsAsync()
      if (res.granted !== locationEnabled) {
        console.log('location permission granted', res.granted)
        setLocationEnabled(res.granted)
      }
    })()
  }, [locationEnabled])

  return <>{locationEnabled && children}</>
})
