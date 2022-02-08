import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { memo } from 'react'
import { Provider } from 'react-redux'
import 'reflect-metadata'
import { LoadData } from './src/components/LoadData'
import { NotificationProvider } from './src/components/NotificationProvider'
import { StatusNotification } from './src/components/StatusNotification'
import { Image } from './src/models/image'
import { MapScreen } from './src/screens/MapScreen'
import { MarkerScreen } from './src/screens/MarkerScreen'
import { TakePhotoScreen } from './src/screens/TakePhotoScreen'
import { store } from './src/store/store'

export type StackParamList = {
  Map: {}
  Marker: { id: string; image?: Image }
  'Take photo': { id: string }
}

const Stack = createNativeStackNavigator<StackParamList>()

const App = memo(() => {
  return (
    <Provider store={store}>
      <LoadData />

      <NotificationProvider>
        <StatusNotification />
      </NotificationProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='Map'>
          <Stack.Screen name='Map' component={MapScreen} />
          <Stack.Screen name='Marker' component={MarkerScreen} />
          <Stack.Screen name='Take photo' component={TakePhotoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
})

// noinspection JSUnusedGlobalSymbols
export default App
