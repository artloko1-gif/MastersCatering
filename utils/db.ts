import { SiteContent } from '../types';
import { db, storage } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'site_content';

export const saveContentToDB = async (content: SiteContent): Promise<void> => {
  if (!db) {
    console.warn("Firestore is not initialized. Cannot save content.");
    throw new Error("Databáze není dostupná.");
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, content);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    throw error;
  }
};

export const getContentFromDB = async (): Promise<SiteContent | null> => {
  if (!db) {
     console.warn("Firestore is not initialized. Returning null to use default content.");
     return null;
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SiteContent;
    } else {
      console.log("No content found in Firestore, returning null (will use default)");
      return null;
    }
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    // Return null to trigger default content fallback
    return null;
  }
};

export const uploadFileToStorage = async (file: Blob | File): Promise<string> => {
  if (!storage) {
    throw new Error("Storage is not initialized");
  }

  // Create a unique filename: images/TIMESTAMP_RANDOM.jpg
  const filename = `images/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const storageRef = ref(storage, filename);

  try {
    // 1. Upload the raw bytes (Blob/File)
    const snapshot = await uploadBytes(storageRef, file);
    
    // 2. Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
};