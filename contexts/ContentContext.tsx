
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentContextType, SiteContent, PortfolioItem, LocationItem, TeamContent } from '../types';

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

const defaultLocations: LocationItem[] = [
  {
    id: '1',
    title: "Rudolfova slévárna",
    description: "Historické prostory Pražského hradu, ideální pro galavečeře a prestižní firemní akce. Jedinečná atmosféra v srdci Prahy.",
    imageUrl: "https://images.unsplash.com/photo-1590623253754-52d37c68b75c?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: '2',
    title: "Sál Sirius",
    description: "Moderní a flexibilní prostory v Pardubicích, vhodné pro konference, plesy a velké oslavy. Nejmodernější technické vybavení.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: '3',
    title: "Speciální vlaky",
    description: "Catering v pohybu - nezapomenutelné zážitky na palubě historických i moderních vlaků. Originální řešení pro netradiční události.",
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2184&auto=format&fit=crop"
  }
];

const defaultTeam: TeamContent = {
  teamImage: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2577&auto=format&fit=crop",
  managerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  managerName: "David Schwarczinger",
  managerRole: "Event & Catering Manager",
  managerQuote: "Event manažer, který se postará o každý detail vaší akce. Jeho organizační schopnosti a smysl pro estetiku zaručují dokonalý průběh.",
  teamMotto: "Vaše spokojenost je naší největší odměnou."
};

const defaultContent: SiteContent = {
  logoUrl: "",
  heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1635&auto=format&fit=crop",
  contactImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
  team: defaultTeam,
  locations: defaultLocations,
  projects: defaultProjects
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('siteContent_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultContent, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load content from local storage", e);
    }
    return defaultContent;
  });

  useEffect(() => {
    try {
      localStorage.setItem('siteContent_v2', JSON.stringify(content));
    } catch (e) {
      console.error("Local Storage Quota Exceeded. Images might be too large.", e);
      alert("Pozor: Změny nebyly uloženy trvale, protože obrázky jsou příliš velké pro paměť prohlížeče. Pro produkční verzi by byl potřeba backend server.");
    }
  }, [content]);

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

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateContent, 
      updateTeam,
      updateLocation,
      addProject, 
      updateProject,
      removeProject 
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
