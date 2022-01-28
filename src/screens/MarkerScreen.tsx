import { memo, useCallback } from 'react'
import { Button, Text, View } from 'react-native'
import { StackParamList } from '../../App'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<StackParamList, 'Marker'>

export const MarkerScreen = memo(({ route, navigation }: Props) => {
  const coords = route.params.coords
  const handlePress = useCallback(() => navigation.goBack(), [navigation])
  return (
    <View>
      <Text>
        Location: ({coords.lat}, {coords.lng})
      </Text>
      <Button title={'Back'} onPress={handlePress} />
    </View>
  )
})
