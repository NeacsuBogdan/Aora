import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from 'react';
import { User } from '@/app/Types/types'; // Importă tipul User

// Definirea valorii implicite pentru context
const GlobalContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  user: null as User | null, // User poate fi null sau un obiect de tip User
  setUser: (user: User | null) => {},
  isLoading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Utilizăm User sau null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true); // Setează true doar dacă utilizatorul nu este guest
          setUser(res); // Setăm utilizatorul doar dacă există
        } else {
          setIsLoggedIn(false); // Asigură-te că rămâne false dacă nu este niciun utilizator autenticat
          setUser(null); // Dacă nu există utilizator, setăm user-ul la null
        }
      })
      .catch((error) => {
        setIsLoggedIn(false); // În cazul unei erori, considerăm că nu este autentificat
        setUser(null); // Nu setăm un guest dacă există o eroare
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
