import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from 'react-native-appwrite';
import { FileAsset, FormData, User } from '@/app/Types/types'

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '67d702cd0021c7e07999',
    databaseId: '67d7045c0028418b0b97',
    userCollectionId: '67d7047a0012ec55b8aa',
    videoCollectionId: '67d7049c0004519741eb',
    bookmarkCollectionId:'680fa8ec001f19d6b73a',
    storageId: "67d705ab001a20924077",
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    bookmarkCollectionId,
    storageId,
} = config 
// Inițializare Appwrite Client
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Creare utilizator nou
export const createUser = async (email: string, password: string, username: string): Promise<User> => {
    try {
      // Creează un cont în Appwrite
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw new Error('Account creation failed');
  
      // Generează avatarul utilizatorului pe baza numelui
      const avatarURL = avatars.getInitials(username);
  
      // Autentifică utilizatorul
      await signIn(email, password);
  
      // Crează un document în baza de date
      const newUserDocument = await databases.createDocument(
        databaseId,
        userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email,
          username,
          avatar: avatarURL
        }
      );
  
      // Returnează un obiect de tip User
      const newUser: User = {
        $id: newUserDocument.$id,  // ID-ul documentului creat
        avatar: newUserDocument.avatar,
        email,
        username
      };
  
      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new Error(error as string);
    }
  };

// Autentificare utilizator
export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error("Error in signIn:", error);
        throw new Error(error as string);
    }
};

// Obținere utilizator curent
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("No account found");

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser || currentUser.documents.length === 0) throw new Error("User not found");

        const userDoc = currentUser.documents[0];

        // Mapare manuală
        const user: User = {
            $id: userDoc.$id,  // presupunem că $id există în Document
            avatar: userDoc.avatar,
            email: userDoc.email,
            username: userDoc.username,
        };

        return user;
    } catch (error) {
        throw error;
    }
};


export const getAllPosts = async () => {
  try {
      const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.orderDesc('$createdAt')]
      );

      return posts.documents;
  } catch (error) {
      // Type assertion pentru a trata error ca fiind un string sau Error
      throw new Error((error as Error).message || "An error occurred");
  }
};


export const getLatestPosts = async () => {
  try {
      const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [
              Query.orderDesc('$createdAt'),
              Query.limit(7)
          ]
      );
      return posts.documents;
  } catch (error) {
      // Type assertion pentru a trata error ca fiind un string sau Error
      throw new Error((error as Error).message || "An error occurred");
  }
};

export const searchPosts = async (query: string, userId: string) => {
    try {
      const lowerCaseQuery = query.toLowerCase(); // Normalizăm query-ul la litere mici
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search('title', lowerCaseQuery)]  // Căutăm titlurile normalizate
      );
  
      const enrichedPosts = posts.documents.map((post) => ({
        ...post,
        userId: userId,
        bookmarks: post.bookmarks || [],
      }));
  
      return enrichedPosts;
    } catch (error) {
      throw new Error((error as Error).message || "An error occurred");
    }
  };
  

export const getUserPosts = async (userId: string) => {

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.equal('creator', userId),
                Query.orderDesc('$createdAt')
            ]
        );
        return posts.documents;
    } catch (error) {
        // Type assertion pentru a trata error ca fiind un string sau Error
        throw new Error((error as Error).message || "An error occurred");
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export const getFilePreview = async (fileId: string, type: 'video' | 'image'): Promise<string> => {
    let fileUrl: string;

    try {
        if (type === 'video') {
            const url = await storage.getFileView(storageId, fileId);
            fileUrl = url.toString(); // Convertim URL la string
        } else if (type === 'image') {
            const url = await storage.getFileView(storageId, fileId);
            fileUrl = url.toString(); // Convertim URL la string
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw new Error('File URL not found');

        return fileUrl;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};

export const uploadFile = async (file: FileAsset, type: 'video' | 'image'): Promise<string | undefined> => {
    if (!file) return;

    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
     };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export const createVideo = async (form: FormData): Promise<any> => {
    try {

      if (!form.thumbnail || !form.video) {
        throw new Error('Thumbnail and video are required.');
      }
      
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video'),
      ]);


      const newPost = await databases.createDocument(
        databaseId,
        videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator:  form.userId, 
        }
      );
      return newPost;
    } catch (error) {
      console.error('Error in createVideo:', error); // Log pentru debugging
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  };
export const getUserBookmarks = async (userId: string): Promise<string[]> => {
  try {
    const response = await databases.listDocuments(databaseId, bookmarkCollectionId, [
      Query.equal("creator", userId),
    ]);

    if (!response.documents) {
      console.error("No documents returned.");
      return [];
    }

    // Extragem doar ID-urile bookmarkurilor
    const bookmarkIds = response.documents.map((doc) => doc.post)

    return bookmarkIds; // Returnăm doar ID-urile bookmarkurilor
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }
};
  

// Adaugă un bookmark
export const addBookmark = async (userId: string, postId: string) => {
    try {
        // Pregătește datele pentru documentul de bookmark
        const bookmarkData = {
            creator: userId, // ID-ul utilizatorului care adaugă bookmark-ul
            post: postId,    // ID-ul postului pe care îl adaugi la bookmarks
        };

        // Crează un document de tip bookmark în colecția dedicată
        const bookmark = await databases.createDocument(
            databaseId,
            bookmarkCollectionId,
            ID.unique(),
            bookmarkData
        );
        return bookmark;
    } catch (error) {
        console.error("Error in addBookmark:", error);  // Log eroare
        throw new Error(error as string);
    }
};


// Șterge un bookmark
export const removeBookmark = async (userId: string, postId: string) => {
    try {
        // Căutăm bookmark-ul pe baza creator și post
        const bookmarks = await databases.listDocuments(
            databaseId,
            bookmarkCollectionId,
            [
                Query.equal('creator', userId), // Căutăm după creator (ID-ul utilizatorului)
                Query.equal('post', postId)     // Căutăm după post (ID-ul postării)
            ]
        );

        // Verificăm dacă există bookmark-ul
        if (bookmarks.documents.length === 0) {
            throw new Error("Bookmark not found");
        }

        // Ștergem documentul (bookmark-ul) găsit
        const bookmarkId = bookmarks.documents[0].$id;
        await databases.deleteDocument(databaseId, bookmarkCollectionId, bookmarkId);

        return { success: true };
    } catch (error) {
        console.error("Error in removeBookmark:", error);
        throw new Error(error as string);
    }
};

export const deleteVideoFromServer = async (videoId: string) => {
    try {
      if (!videoId) throw new Error("No video ID provided");
  
      // Ștergem documentul din baza de date (colecția de videoclipuri)
      await databases.deleteDocument(databaseId, videoCollectionId, videoId);
  
      console.log(`Video with ID ${videoId} was deleted successfully.`);
    } catch (error) {
      console.error("Error deleting video:", error);
      throw new Error(error as string);  // Aruncăm o eroare dacă ceva nu merge
    }
  };
  