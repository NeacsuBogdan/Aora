export type FileAsset = {
    fileName: string;
    mimeType: string;
    fileSize: number;
    uri: string;
  };
  
export interface FormData {
    title: string;
    video: FileAsset | null; // Permitem null
    thumbnail: FileAsset | null; // Permitem null
    prompt: string;
    userId: string | null; // Permitem null
  }
  
  export interface User {
    $id: string;
    avatar: string;
    email: string;
    username: string;
  }
  
  