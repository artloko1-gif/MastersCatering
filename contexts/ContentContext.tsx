import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem, LocationItem, TeamContent, Inquiry } from '../types';
import { saveContentToDB, getContentFromDB } from '../utils/db';
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
          // Merge with default to ensure new fields (like inquiries) exist if DB has old structure
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

  const removeProject = (id: string) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addInquiry = (inquiry: Inquiry) => {
    setContent(prev => ({
      ...prev,
      inquiries: [inquiry, ...(prev.inquiries || [])]
    }));
    // Note: We might want to auto-save inquiries to DB even if other content isn't saved, 
    // but for simplicity we keep state separate. In a real app, inquiries would be a separate collection.
  };

  const removeInquiry = (id: string) => {
    setContent(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter(i => i.id !== id)
    }));
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