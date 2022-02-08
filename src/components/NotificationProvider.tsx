import { requestPermissionsAsync, setNotificationHandler } from 'expo-notifications'
import React, { memo, useEffect, useState } from 'react'

export const NotificationProvider = memo(({ children }: { children?: React.ReactNode }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldSetBadge: true,
        shouldPlaySound: false
      })
    })
  }, [])

  useEffect(() => {
    ;(async () => {
      const res = await requestPermissionsAsync()
      if (res.granted !== notificationsEnabled) {
        console.log('notifications permission granted', res.granted)
        setNotificationsEnabled(res.granted)
      }
    })()
  }, [notificationsEnabled])

  return <>{notificationsEnabled && children}</>
})
