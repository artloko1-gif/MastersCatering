import { SiteContent, PortfolioItem, Inquiry } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';
const MAIN_DOC_ID = 'site_content';
const PROJECTS_COLLECTION = 'projects';
const INQUIRIES_COLLECTION = 'inquiries';

// Helper to save everything properly distributed
export const saveContentToDB = async (content: SiteContent): Promise<void> => {
  if (!db) {
    console.warn("Firestore is not initialized. Cannot save content.");
    throw new Error("Databáze není dostupná.");
  }
  try {
    const batch = writeBatch(db);

    // 1. Separate heavy data (projects, inquiries) from main config
    const { projects, inquiries, ...mainConfig } = content;

    // 2. Queue main config save
    const mainDocRef = doc(db, SETTINGS_COLLECTION, MAIN_DOC_ID);
    batch.set(mainDocRef, mainConfig);

    // 3. Queue Projects save (each project = 1 document)
    // This solves the 1MB limit issue
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.set(projectRef, project);
      });
    }

    // 4. Queue Inquiries save
    if (inquiries && inquiries.length > 0) {
      inquiries.forEach(inquiry => {
        const inquiryRef = doc(db, INQUIRIES_COLLECTION, inquiry.id);
        batch.set(inquiryRef, inquiry);
      });
    }

    // Execute all writes atomically
    await batch.commit();
    console.log("Content saved successfully via batch write.");

  } catch (error) {
    console.error("Error saving to Firestore:", error);
    throw error;
  }
};

// Helper to delete specific documents directly
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
    if(!db) return;
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
        console.error(`Error deleting ${docId} from ${collectionName}`, error);
        throw error;
    }
}

export const getContentFromDB = async (): Promise<SiteContent | null> => {
  if (!db) {
     console.warn("Firestore is not initialized. Returning null.");
     return null;
  }
  try {
    // 1. Fetch Main Config
    const mainDocRef = doc(db, SETTINGS_COLLECTION, MAIN_DOC_ID);
    const mainDocSnap = await getDoc(mainDocRef);
    
    let mainContent: any = {};
    if (mainDocSnap.exists()) {
        mainContent = mainDocSnap.data();
    }

    // 2. Fetch Projects Collection
    const projectsSnap = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects: PortfolioItem[] = [];
    projectsSnap.forEach(doc => {
        projects.push(doc.data() as PortfolioItem);
    });
    
    // Sort projects by date (assuming newer is added first/top, or relying on manual sort logic later)
    // Here we just ensure we have them. 
    // If the legacy 'mainContent' still has projects (from before the migration), we prefer the collection ones if they exist.
    const finalProjects = projects.length > 0 ? projects : (mainContent.projects || []);

    // 3. Fetch Inquiries Collection
    const inquiriesSnap = await getDocs(collection(db, INQUIRIES_COLLECTION));
    const inquiries: Inquiry[] = [];
    inquiriesSnap.forEach(doc => {
        inquiries.push(doc.data() as Inquiry);
    });
    
    // Sort inquiries by created date descending
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const finalInquiries = inquiries.length > 0 ? inquiries : (mainContent.inquiries || []);

    // 4. Combine everything
    if (!mainDocSnap.exists() && projects.length === 0) {
        return null; // Trigger default content
    }

    return {
        ...mainContent,
        projects: finalProjects,
        inquiries: finalInquiries
    } as SiteContent;

  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    return null;
  }
};