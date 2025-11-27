import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem } from '../types';

const defaultProjects: PortfolioItem[] = [
  {
    id: '1',
    title: "Galavečeře pro Qatar Airways Cargo",
    client: "Qatar Airways Cargo",
    date: "3. 4. 2025",
    guests: 300,
    location: "Rudolfova slévárna, Pražský hrad",
    description: "Luxusní galavečeře v historických prostorách, která uchvátila hosty z celého světa. Kulinářský zážitek hodný královského sídla.",
    imageUrls: [
      "https://images.unsplash.com/photo-1519225469958-319ea327d92f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
    ],
    tags: ["Galavečeře", "VIP", "300 Hostů"]
  },
  {
    id: '2',
    title: "Jízda s tříchodovým menu v Ringhofferu",
    description: "Nostalgická jízda historickým jídelním vozem Ringhoffer s exkluzivním tříchodovým menu. Jedinečná kombinace cestování a gastronomie.",
    imageUrls: [
      "https://images.unsplash.com/photo-1485394582334-706d4e8c1050?q=80&w=1925&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2184&auto=format&fit=crop"
    ],
    tags: ["Historický vlak", "Zážitková gastronomie"]
  }
];

const defaultContent: SiteContent = {
  heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1635&auto=format&fit=crop",
  projects: defaultProjects
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('siteContent');
    // Migration logic in case old data structure exists in local storage
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure projects have imageUrls array even if loaded from old data
      if (parsed.projects) {
        parsed.projects = parsed.projects.map((p: any) => ({
          ...p,
          imageUrls: p.imageUrls || (p.imageUrl ? [p.imageUrl] : [])
        }));
      }
      return parsed;
    }
    return defaultContent;
  });

  useEffect(() => {
    localStorage.setItem('siteContent', JSON.stringify(content));
  }, [content]);

  const updateGlobalImages = (hero: string, about: string) => {
    setContent(prev => ({
      ...prev,
      heroImage: hero,
      aboutImage: about
    }));
  };

  const addProject = (project: PortfolioItem) => {
    setContent(prev => ({
      ...prev,
      // Add to beginning of array (newest first)
      projects: [project, ...prev.projects]
    }));
  };

  const removeProject = (id: string) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  return (
    <ContentContext.Provider value={{ content, updateGlobalImages, addProject, removeProject }}>
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