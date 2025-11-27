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
    imageUrl: "https://images.unsplash.com/photo-1519225469958-319ea327d92f?q=80&w=2070&auto=format&fit=crop",
    tags: ["Galavečeře", "VIP", "300 Hostů"]
  },
  {
    id: '2',
    title: "Jízda s tříchodovým menu v Ringhofferu",
    description: "Nostalgická jízda historickým jídelním vozem Ringhoffer s exkluzivním tříchodovým menu. Jedinečná kombinace cestování a gastronomie.",
    imageUrl: "https://images.unsplash.com/photo-1485394582334-706d4e8c1050?q=80&w=1925&auto=format&fit=crop",
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
    return saved ? JSON.parse(saved) : defaultContent;
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
