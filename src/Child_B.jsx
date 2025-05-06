import { View, Text } from 'react-native'
import React, { memo } from 'react'
import Child_C from './Child_C'

const Child_B = ({item}) => {
  console.log('The props is ',item)
  return (
    <View>
        <Text>{item}</Text>
    </View>
  )
}

export default memo(Child_B) 