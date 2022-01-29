import { memo } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MapScreen } from './src/screens/MapScreen'
import { MarkerScreen } from './src/screens/MarkerScreen'
import { store } from './src/store/store'
import { Provider } from 'react-redux'

export type StackParamList = {
  Map: {}
  Marker: { id: string }
}

const Stack = createNativeStackNavigator<StackParamList>()

const App = memo(() => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Map'>
          <Stack.Screen name='Map' component={MapScreen} />
          <Stack.Screen name='Marker' component={MarkerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
})

// noinspection JSUnusedGlobalSymbols
export default App
