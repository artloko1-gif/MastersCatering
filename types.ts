import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  date?: string;
  guests?: number;
  location?: string;
  description: string;
  imageUrls: string[];
  tags: string[];
}

export interface LocationItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  // Icons are handled in the component mapping to avoid serializing functions
}

export interface TeamContent {
  groupImage: string;
  managerImage: string;
  managerName: string;
  managerRole: string;
  managerQuote: string;
  teamMotto: string;
}

export interface SiteContent {
  heroImage: string;
  aboutImage: string;
  projects: PortfolioItem[];
  locations: LocationItem[];
  team: TeamContent;
}

export interface ContentContextType {
  content: SiteContent;
  updateGlobalImages: (hero: string, about: string) => void;
  
  // Projects
  addProject: (project: PortfolioItem) => void;
  updateProject: (id: string, project: PortfolioItem) => void;
  removeProject: (id: string) => void;
  
  // Other Sections
  updateTeam: (data: TeamContent) => void;
  updateLocations: (locations: LocationItem[]) => void;
}