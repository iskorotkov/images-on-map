import { dismissNotificationAsync, scheduleNotificationAsync } from 'expo-notifications'
import { memo, useEffect } from 'react'

export const StatusNotification = memo(() => {
  useEffect(() => {
    let identifier: string
    ;(async () => {
      identifier = await scheduleNotificationAsync({
        content: {
          title: 'Notifications about nearest markers enabled',
          body: 'Images on map will show you notifications when you are near your markers',
          color: '#44f',
          sticky: true
        },
        trigger: {
          seconds: 1
        }
      })
      console.debug('showing status notification', identifier)
    })()

    return () => {
      if (identifier) {
        console.debug('removing old status notification', identifier)
        dismissNotificationAsync(identifier)
      }
    }
  }, [])

  return <></>
})
