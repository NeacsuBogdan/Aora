import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router';
import React from 'react';

import { icons } from '../../constants';



// Tipurile pentru props
type TabIconProps = {
  icon: any;    // Folosește un tip adecvat pentru `icon` (de ex. `ImageSourcePropType` din `react-native`)
  color: string;
  name: string;
  focused: boolean;
};


const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
    return (
      <View className='items-center justify-center gap-1 min-w-[60px]'>
        <Image 
          source={ icon }
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
        <Text className={`${focused ? 'font-semibold' : 'font-normal'} text-xs text-nowrap`} style={{color:color}}>
          {name}
        </Text>
      </View>
    )
} 


const TabsLayout = () => {
  return (
    <>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 5,
          borderTopColor: '#232533',
          height: 84,

        }
      }}
    >
      <Tabs.Screen
      name="home"
      options={{
        title:"home",
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon
            icon={icons.home}
            color={color}
            name="Home"
            focused={focused}
          />
        )
      }}
      />
            <Tabs.Screen
      name="bookmark"
      options={{
        title:"Bookmark",
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon
            icon={icons.bookmark}
            color={color}
            name="Bookmark"
            focused={focused}
          />
        )
      }}
      />
            <Tabs.Screen
      name="create"
      options={{
        title:"Create",
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon
            icon={icons.plus}
            color={color}
            name="Create"
            focused={focused}
          />
        )
      }}
      />
            <Tabs.Screen
      name="profile"
      options={{
        title:"Profile",
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon
            icon={icons.profile}
            color={color}
            name="Profile"
            focused={focused}
          />
        )
      }}
      />
    </Tabs>
    </>
  )
}

export default TabsLayout