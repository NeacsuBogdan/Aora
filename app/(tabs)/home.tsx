import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';

const Home = () => {
  const { user, bookmarks, setBookmarks } = useGlobalContext(); // Obținem bookmarks din context

  // State pentru postari
  const [posts, setPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const latestPostsData = await getLatestPosts();
      setLatestPosts(latestPostsData);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    await fetchLatestPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchLatestPosts();
    }
  }, [user]); // Dependință pe user pentru a actualiza doar când user-ul se schimbă

  return (
    <SafeAreaView className='bg-black h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.$id || index.toString()}
        renderItem={({ item }) => (
          <VideoCard 
            video={{
              title: item.title,
              thumbnail: item.thumbnail,
              video: item.video,
              creator: item.creator,
              id: item.$id,
              userId: item.creator.$id || ''
            }}
          />
        )}        
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className='font-medium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='text-3xl font-semibold text-white'>
                  {user?.username || 'Guest'}
                </Text>
              </View>
              <View className='mt-1.5'>
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-normal mb-3'>
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;