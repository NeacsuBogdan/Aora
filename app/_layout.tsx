import { Stack } from 'expo-router';
import "../global.css";
import { GlobalProvider } from '@/context/GlobalProvider';

const Rootlayout = () => {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="search/[query]" options={{ headerShown: false }}/>
      </Stack>   
    </GlobalProvider>
  )
}

export default Rootlayout
