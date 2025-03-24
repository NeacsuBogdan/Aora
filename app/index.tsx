import { ScrollView, Text, View, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Redirect , router } from 'expo-router';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';



export default function App () {
const {isLoading, isLoggedIn} = useGlobalContext();

if(!isLoading && isLoggedIn ) return <Redirect href="/home"/>

  return (
    <SafeAreaView className='bg-black h-full'>
      <ScrollView 
        contentContainerStyle={{
            height: '100%'
        }}>
          <View className='w-full justify-center items-center min-h-[85vh] px-4'>
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />
            <Image
              source={images.cards}
              className='w-[380px] h-[300px]'
              resizeMode='contain'
            />

            <View className='relative mt-5'>
              <Text className='text-4xl text-white font-bold text-center'>
                  Discover endles posibility with {' '}
                  <Text className='color-orange-400'>
                    Aora
                  </Text>
              </Text>

              <Image
                source={images.path}
                className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
                resizeMode='contain'
              />
            </View>
            <Text className='text-sm font-normal text-gray-100 mt-5 text-center'>
              Where cretivity meets innovation: embark on  journey of limitless explortion with Aora
            </Text>

              <CustomButton
                title="Continue with Email"
                handlePress={() => router.push('/sign-in')}
                containerStyles="w-full mt-7"
                textStyles={undefined}
                isLoading={undefined}
              />


          </View>


      </ScrollView>
      <StatusBar backgroundColor='#161622'
      style='light'/>
    </SafeAreaView>
  );
}
