import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({title, subtitle, containerStyles, titleStyle}) => {
  return (
    <View className={containerStyles}>
        <Text className={`text-white text-center font-semibold ${titleStyle}`}>
            {title}
        </Text>
        <Text className='text-sm text-gray-100 text-center font-normal'>
            {subtitle}
        </Text>
    </View>
  )
}

export default InfoBox