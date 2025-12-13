import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem, LocationItem, TeamContent, Inquiry, ClientItem } from '../types';
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
          // Migration logic for Locations:
          const migratedLocations = (dbContent.locations || defaultContent.locations).map((loc: any) => {
             if (loc.imageUrls && Array.isArray(loc.imageUrls)) {
               return loc as LocationItem;
             } else if (loc.imageUrl) {
               return { ...loc, imageUrls: [loc.imageUrl] } as LocationItem;
             } else {
               return { ...loc, imageUrls: [] } as LocationItem;
             }
          });

          // Migration logic for Hero Images:
          // If dbContent has heroImage but not heroImages, create the array
          let heroImages = dbContent.heroImages;
          if (!heroImages || !Array.isArray(heroImages) || heroImages.length === 0) {
            heroImages = dbContent.heroImage ? [dbContent.heroImage] : defaultContent.heroImages;
          }

          // Merge with default
          setContent(prev => ({ 
             ...defaultContent, 
             ...dbContent,
             locations: migratedLocations,
             clients: dbContent.clients || defaultContent.clients,
             heroImages: heroImages
          }));
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

  // CLIENT MANAGEMENT
  const addClient = (client: ClientItem) => {
    setContent(prev => ({
      ...prev,
      clients: [...(prev.clients || []), client]
    }));
  };

  const updateClient = (id: string, data: Partial<ClientItem>) => {
    setContent(prev => ({
      ...prev,
      clients: (prev.clients || []).map(c => c.id === id ? { ...c, ...data } : c)
    }));
  };

  const removeClient = (id: string) => {
    setContent(prev => ({
      ...prev,
      clients: (prev.clients || []).filter(c => c.id !== id)
    }));
  };

  const reorderClients = (newOrder: ClientItem[]) => {
    setContent(prev => ({
      ...prev,
      clients: newOrder
    }));
  };

  // IMMEDIATE SAVE for Inquiries (from Public Site)
  const addInquiry = async (inquiry: Inquiry) => {
    const newInquiries = [inquiry, ...(content.inquiries || [])];
    
    // Update local state
    setContent(prev => ({
      ...prev,
      inquiries: newInquiries
    }));

    // Save to DB immediately
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
    const remainingInquiries = (content.inquiries || []).filter(i => i.id !== id);
    
    setContent(prev => ({
      ...prev,
      inquiries: remainingInquiries
    }));

    if (isInitialized) {
      await saveContentToDB({ ...content, inquiries: remainingInquiries });
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
      addClient,
      updateClient,
      removeClient,
      reorderClients,
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