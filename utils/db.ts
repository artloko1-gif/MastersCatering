import { SiteContent } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'site_content';

export const saveContentToDB = async (content: SiteContent): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, content);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    throw error;
  }
};

export const getContentFromDB = async (): Promise<SiteContent | null> => {
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