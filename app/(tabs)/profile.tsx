import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { getUserPosts, signOut } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { router, useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  // Asigură-te că posts este întotdeauna un tablou gol dacă nu există date
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user?.$id || ''));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className='bg-black h-full'>
      <FlatList
        data={posts || []}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <VideoCard
            video={{
              title: item.title,
              thumbnail: item.thumbnail,
              video: item.video,
              creator: item.creator,
              id: item.$id,                 // <-- id-ul postării
              userId: item.creator.$id || '' // <-- id-ul creatorului
            }}
          />
        )}                
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-16 h-16 border border-orange-400 rounded-lg justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />
            </View>
            <InfoBox
              title={user?.username}
              subtitle={undefined}
              containerStyles='mt-5'
              titleStyle='text-lg'
            />
            <View className='mt-5 flex-row'>
              <InfoBox
                title={posts?.length || 0}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyle='text-2xl'
              />
              <InfoBox
                title='1.2k'
                subtitle='Followers'
                titleStyle='text-2xl'
                containerStyles={undefined}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
