import { View, Text, FlatList } from 'react-native';
import React, { useEffect , useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { searchPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';


const Search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const [bookmarkedVideoIds, setBookmarkedVideoIds] = useState<any[]>([]); // Lista cu videoId-uri
  // Verificăm dacă query este un string (dacă este un array de stringuri, luăm primul element)
  const searchQuery = Array.isArray(query) ? query[0] : query;

  // Verificăm dacă user există înainte de a folosi user.$id
  const userId = user ? user.$id : '';

  const { data: posts, refetch } = useAppwrite(() => searchPosts(searchQuery, userId));


  useEffect(() => {
    refetch();
  }, [searchQuery, userId]);

  return (
    <SafeAreaView className="bg-black h-full">
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
              userId: user?.$id || ''
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-medium text-sm text-gray-100">Search results</Text>
            <Text className="text-3xl font-semibold text-white">{searchQuery}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={searchQuery} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="Try a different search" />
        )}
      />
    </SafeAreaView>
  );
};


export default Search;
