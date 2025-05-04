import { getCurrentUser, getUserBookmarks } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { User } from "@/app/Types/types";

// Context inițial
const GlobalContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  user: null as User | null,
  setUser: (user: User | null) => {},
  isLoading: true,
  bookmarks: [] as string[],
  setBookmarks: (bookmarks: string[]) => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]); // bookmarks separat

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
          await fetchUserBookmarks(res.$id); // după ce avem userul, chemăm separat bookmarks
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchUserBookmarks = async (userId: string) => {
    try {
      const bookmarksData = await getUserBookmarks(userId);
      console.log("Fetched bookmarks:", bookmarksData); // log aici
      setBookmarks(bookmarksData);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarks([]); // în caz de eroare, golim bookmarks
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        bookmarks,
        setBookmarks,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
