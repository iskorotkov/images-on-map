import { memo } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MapScreen } from './src/screens/MapScreen'
import { MarkerScreen } from './src/screens/MarkerScreen'
import { Coords } from 'google-map-react'

export type StackParamList = {
  Map: {}
  Marker: { coords: Coords }
}

const Stack = createNativeStackNavigator<StackParamList>()

const App = memo(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Map'>
        <Stack.Screen name='Map' component={MapScreen} />
        <Stack.Screen name='Marker' component={MarkerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})

// noinspection JSUnusedGlobalSymbols
export default App
