import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { icons } from '@/constants';

type Creator = {
    username: string;
    avatar: string;
  };
  
  type VideoProps = {
    title: string;
    thumbnail: string;
    video: string;
    creator: Creator;
  };

const VideoCard = ({ video: { title, thumbnail, video, creator: { username, avatar } } }: { video: VideoProps }) => {
  const [play, setPlay] = useState(false);

  // Folosim useRef pentru a face referință la video, specificăm tipul corect
  const videoRef = useRef<Video | null>(null);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-orange-400 justify-center items-center p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-normal" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          ref={videoRef}
          source={{ uri: video }}
          style={{
            width: '100%',
            height: 240,
            borderRadius: 15,
            marginTop: 12,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            // Verificăm tipul înainte de a accesa didJustFinish
            if ('didJustFinish' in status && status.didJustFinish) {
              setPlay(false);
              videoRef.current?.stopAsync();
            }
          }}
          onLoad={() => videoRef.current?.playAsync()}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            videoRef.current?.playAsync();
          }}
        >
          <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl mt-3" resizeMode="cover" />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
