import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { icons } from '@/constants';
import { addBookmark, removeBookmark, deleteVideoFromServer } from '@/lib/appwrite';  // Asigură-te că funcția corectă este importată
import { useGlobalContext } from '@/context/GlobalProvider';

type Creator = {
  username: string;
  avatar: string;
};

export type VideoProps = {
  title: string;
  thumbnail: string;
  video: string;
  creator: Creator;
  id: string;
  userId: string;
};

const VideoCard = ({
  video: { title, thumbnail, video, creator: { username, avatar }, id, userId }
}: { video: VideoProps }) => {
  const [play, setPlay] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const { bookmarks, setBookmarks, user } = useGlobalContext();
  const videoRef = useRef<Video | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setLiked(bookmarks.includes(id));
  }, [bookmarks, id]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOutsidePress = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (!userId || !id) {
        console.error("Missing user ID or video ID");
        return;
      }

      if (liked) {
        await removeBookmark(userId, id);
        setBookmarks(bookmarks.filter(videoId => videoId !== id));
      } else {
        await addBookmark(userId, id);
        setBookmarks([...bookmarks, id]);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const deleteVideo = async (videoId: string) => {
    try {
      // Apelăm funcția de ștergere video din server
      await deleteVideoFromServer(videoId);  // Funcția corectă de ștergere
      console.log("Video deleted successfully");
      // Dacă ai o listă de video-uri, ar trebui să o actualizezi aici pentru a elimina acel video
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const confirmDelete = async () => {
    await deleteVideo(id);  // Apelăm funcția de ștergere cu ID-ul video-ului
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row items-center w-full">
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

          <View className="flex-row items-center">
            <TouchableOpacity onPress={toggleBookmark} className={`px-2 py-1 ${menuVisible ? 'ml-0' : 'ml-auto'}`}>
              <Image
                source={liked ? icons.like : icons.nolike}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>

            {user?.$id === userId && (
              <>
                <TouchableOpacity onPress={toggleMenu} className="px-2 py-1 ml-2">
                  <Image
                    source={icons.menu}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {menuVisible && (
                  <TouchableOpacity onPress={handleDeletePress} className="px-2 py-1 ml-2">
                    <Text className="text-red-500">Delete</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        <View className="w-full h-60 rounded-xl overflow-hidden mt-3">
          <TouchableOpacity onPress={() => setPlay(!play)} activeOpacity={0.9}>
            {play ? (
              <Video
                ref={videoRef}
                source={{ uri: video }}
                className="w-full h-full"
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
              />
            ) : (
              <Image
                source={{ uri: thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* MODAL pentru confirmare ștergere */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View className="flex-1 bg-black bg-opacity-70 justify-center items-center">
            <View className="bg-white rounded-lg p-6 w-80 items-center">
              <Text className="text-black text-lg font-semibold mb-4 text-center">
                Are you sure you want to delete the video?
              </Text>
              <Image
                source={{ uri: thumbnail }}
                className="w-40 h-24 mb-4 rounded-md"
                resizeMode="cover"
              />
              <Text className="text-black text-center mb-6 font-medium">{title}</Text>

              <View className="flex-row justify-between w-full">
                <TouchableOpacity
                  onPress={cancelDelete}
                  className="flex-1 mr-2 bg-gray-300 rounded-md py-2"
                >
                  <Text className="text-center text-black">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmDelete}
                  className="flex-1 ml-2 bg-red-500 rounded-md py-2"
                >
                  <Text className="text-center text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VideoCard;
