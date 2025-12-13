import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem, LocationItem, TeamContent, Inquiry } from '../types';
import { saveContentToDB, getContentFromDB, deleteDocument } from '../utils/db';
import { defaultContent } from '../data/defaultContent';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load content from Firestore on mount
  useEffect(() => {
    const load = async () => {
      try {
        const dbContent = await getContentFromDB();
        if (dbContent) {
          // Merge with default to ensure new fields exist if DB has old structure
          // Note: dbContent now comes from merged collections + main doc
          setContent(prev => ({ ...defaultContent, ...dbContent }));
        }
      } catch (e) {
        console.error("Failed to load content from DB", e);
      } finally {
        setIsInitialized(true);
      }
    };
    load();
  }, []);

  const updateContent = (newContent: Partial<SiteContent>) => {
    setContent(prev => ({ ...prev, ...newContent }));
  };

  const updateTeam = (teamData: Partial<TeamContent>) => {
    setContent(prev => ({
      ...prev,
      team: { ...prev.team, ...teamData }
    }));
  };

  const updateLocation = (id: string, data: Partial<LocationItem>) => {
    setContent(prev => ({
      ...prev,
      locations: prev.locations.map(loc => loc.id === id ? { ...loc, ...data } : loc)
    }));
  };

  const addProject = (project: PortfolioItem) => {
    setContent(prev => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
  };

  const updateProject = (id: string, projectData: Partial<PortfolioItem>) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...projectData } : p)
    }));
  };

  const removeProject = async (id: string) => {
    // 1. Remove from local state
    setContent(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));

    // 2. Remove from DB immediately to free up space/cleanup
    if (isInitialized) {
       try {
           await deleteDocument('projects', id);
       } catch (e) {
           console.error("Failed to delete project from DB", e);
       }
    }
  };

  // IMMEDIATE SAVE for Inquiries (from Public Site)
  const addInquiry = async (inquiry: Inquiry) => {
    const newInquiries = [inquiry, ...(content.inquiries || [])];
    
    // Update local state
    setContent(prev => ({
      ...prev,
      inquiries: newInquiries
    }));

    // Save to DB immediately (using saveContentToDB which handles the split)
    if (isInitialized) {
      await saveContentToDB({ ...content, inquiries: newInquiries });
    }
  };

  // IMMEDIATE SAVE for Inquiry Status (from Admin)
  const updateInquiry = async (id: string, status: 'new' | 'solved' | 'irrelevant') => {
    const updatedInquiries = (content.inquiries || []).map(inq => 
      inq.id === id ? { ...inq, status } : inq
    );

    setContent(prev => ({
      ...prev,
      inquiries: updatedInquiries
    }));

    if (isInitialized) {
      await saveContentToDB({ ...content, inquiries: updatedInquiries });
    }
  };

  const removeInquiry = async (id: string) => {
    // 1. Remove from local state
    const remainingInquiries = (content.inquiries || []).filter(i => i.id !== id);
    setContent(prev => ({
      ...prev,
      inquiries: remainingInquiries
    }));

    // 2. Remove from DB immediately
    if (isInitialized) {
       try {
           await deleteDocument('inquiries', id);
       } catch (e) {
           console.error("Failed to delete inquiry from DB", e);
       }
    }
  };

  const saveToCloud = async () => {
    if (isInitialized) {
      await saveContentToDB(content);
    }
  };

  if (!isInitialized) {
     return (
       <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p className="text-slate-500 font-medium animate-pulse">Načítám obsah z databáze...</p>
       </div>
     );
  }

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateContent, 
      updateTeam,
      updateLocation,
      addProject, 
      updateProject,
      removeProject,
      addInquiry,
      updateInquiry,
      removeInquiry,
      saveToCloud
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};