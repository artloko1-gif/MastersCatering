
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem, LocationItem, TeamContent, Inquiry } from '../types';
import { saveContentToDB, getContentFromDB } from '../utils/db';
import { defaultContent } from '../data/defaultContent';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load content from IndexedDB on mount
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

  // Save content to IndexedDB whenever it changes (debounced could be better, but direct is fine for now with IDB)
  useEffect(() => {
    if (isInitialized) {
      saveContentToDB(content).catch(err => {
        console.error("Failed to save to DB:", err);
      });
    }
  }, [content, isInitialized]);

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
  };

  const removeInquiry = (id: string) => {
    setContent(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter(i => i.id !== id)
    }));
  };

  if (!isInitialized) {
     return <div className="h-screen w-full flex items-center justify-center text-slate-500">Načítám obsah...</div>;
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
      removeInquiry
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
