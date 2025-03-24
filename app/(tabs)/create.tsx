import { View, Text, TouchableOpacity, Image, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import { ResizeMode, Video } from 'expo-av';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FileAsset, FormData } from '@/app/Types/types'


const Create = () => {

  const { user } = useGlobalContext();


  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<FormData>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
    userId: user ? user.$id : null, // Adăugăm userId aici
  });

  const openPicker = async (selectType: 'image' | 'video') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== 'granted') {
        return Alert.alert('Permisiuni refuzate', 'Aplicația necesită permisiuni pentru a accesa galeria.');
      }
  
      let media = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: selectType === 'image' 
          ? ImagePicker.MediaTypeOptions.Images 
          : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!media.canceled && media.assets && media.assets.length > 0) {
        const selectedAsset = media.assets[0];
  
        // Convertirea ImagePickerAsset într-un FileAsset
        const fileAsset: FileAsset = {
          fileName: selectedAsset.uri.split('/').pop() || '',
          mimeType: selectedAsset.type || 'image/jpeg',  // Presupunem că este imagine dacă nu se specifică tipul
          fileSize: selectedAsset.fileSize || 0,  // Asigură-te că ai un fallback în cazul în care fileSize este null
          uri: selectedAsset.uri,
        };
  
        // Setarea valorii în funcție de tipul selectat
        if (selectType === 'image') {
          setForm((prevForm) => ({ ...prevForm, thumbnail: fileAsset }));
        } else {
          setForm((prevForm) => ({ ...prevForm, video: fileAsset }));
        }
      }
    } catch (error) {
      console.log('Eroare la selecția fișierului:', error);
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      return Alert.alert('Please fill in all the fields');
    }
  
    setUploading(true);
  
    try {
      await createVideo({
        ...form,
        userId: form.userId, // Asigură-te că userId este transmis corect
      });
  
      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Acum TypeScript știe că error este de tip Error
        Alert.alert('Error', error.message);
      } else {
        // Dacă eroarea nu este de tipul Error, afișezi un mesaj generic
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
        userId: user?.$id ?? null,
      });
      setUploading(false);
    }
  };
  
  

  return (
    <SafeAreaView className="bg-black h-full">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="px-4 my-6">
            <Text className="text-3xl text-white font-semibold">
              Upload Video
            </Text>
            <FormField
              title="Video Title"
              value={form.title}
              placeholder="Give your video a catchy title"
              handleChangeText={(e: string) => setForm({ ...form, title: e })}
              otherStyles="mt-10"
            />

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Upload Video
              </Text>
              <TouchableOpacity onPress={() => openPicker('video')}>
                {form.video ? (
                  <Video
                    key={form.video.uri}
                    source={{ uri: form.video.uri }}
                    style={{ width: '100%', height: 200 }}
                    resizeMode={ResizeMode.COVER}
                  />
                ) : (
                  <View className="w-full h-40 px-4 bg-slate-800 rounded-2xl justify-center items-center">
                    <View className="w-14 h-14 border border-dashed border-orange-400 justify-center items-center">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        className="w-1/2 h-1/2"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-7 space-y-2">
              <Text className="text-base text-white font-semibold">
                Thumbnail Image
              </Text>
              <TouchableOpacity onPress={() => openPicker('image')}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode="cover"
                    className="w-full h-64 rounded-2xl"
                  />
                ) : (
                  <View className="w-full h-16 px-4 bg-slate-800 rounded-2xl justify-center items-center border-2 border-slate-700 flex-row space-x-2">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-5 h-5"
                    />
                    <Text className="text-sm text-gray-100 font-medium ml-2">
                      Choose a file
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormField
              title="AI Prompt"
              value={form.prompt}
              placeholder="The prompt you used to create this video"
              handleChangeText={(e: string) => setForm({ ...form, prompt: e })}
              otherStyles="mt-10"
            />

              <CustomButton
                title="Submit & Publish"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={uploading}
                textStyles={undefined}
              />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Create;
