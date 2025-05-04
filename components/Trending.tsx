import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, ViewToken } from 'react-native';
import { View as ViewAnima } from 'react-native-animatable';
import React, { useState, useRef } from 'react';
import { icons } from '@/constants';
import { Video, ResizeMode } from 'expo-av';

const zoomIn = {
  0: { scaleX: 0.9, scaleY: 0.9 },
  1: { scaleX: 1, scaleY: 1 },
};

const zoomOut = {
  0: { scaleX: 1, scaleY: 1 },
  1: { scaleX: 0.9, scaleY: 0.9 },
};

type Post = {
  $id: string;
  video: string;
  thumbnail: string;
};

const TrendingItem = ({ activeItem, item }: { activeItem: string; item: Post }) => {
  const [play, setPlay] = useState(false);
  const videoRef = useRef<Video | null>(null);

  return (
    <ViewAnima 
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          ref={videoRef}
          source={{ uri: item.video }}
          style={{
            width: 200,
            height: 300,
            borderRadius: 35,
            marginTop: 12,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            if ('didJustFinish' in status && status.didJustFinish) {
              setPlay(false);
              videoRef.current && videoRef.current.stopAsync();
            }
          }}
          onLoad={() => videoRef.current && videoRef.current.playAsync()}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            videoRef.current?.playAsync();
          }}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{
              width: 200,
              height: 300,
              borderRadius: 35,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.4,
              shadowRadius: 10,
            }}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={{
              width: 48,
              height: 48,
              position: 'absolute',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </ViewAnima>
  );
};

const Trending = ({ posts }: { posts: Post[] }) => {
  const [activeItem, setActiveItem] = useState(posts[1]?.$id || posts[0]?.$id || '');

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisible = viewableItems[0]?.item;
      if (firstVisible && firstVisible.$id) {
        setActiveItem(firstVisible.$id);
      }
    }
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
