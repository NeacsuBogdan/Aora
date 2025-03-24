import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Noua stare pentru focus

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-medium mb-2 ml-2'>
        {title}
      </Text>
      <View
        className={`border-2 w-full h-16 px-4 bg-slate-800 rounded-2xl flex-row items-center ${
          isFocused ? 'border-orange-400' : 'border-black' // Modifică border-ul pe focus
        }`}
      >
        <TextInput
          className='flex-1 text-white font-semibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          onFocus={() => setIsFocused(true)} // Când câmpul primește focus
          onBlur={() => setIsFocused(false)} // Când câmpul pierde focus
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className='w-6 h-6'
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
