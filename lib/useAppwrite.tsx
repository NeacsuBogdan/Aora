import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useAppwrite = (fn: () => Promise<any>) => {
  const [data, setData] = useState<any>(null);  // Folosim `any` pentru `data`
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();
  
  return { data, isLoading, refetch };
};

export default useAppwrite;
