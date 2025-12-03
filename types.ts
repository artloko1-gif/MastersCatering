
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
}

export interface TeamContent {
  teamImage: string;
  managerImage: string;
  managerName: string;
  managerRole: string;
  managerQuote: string;
  teamMotto: string;
}

export interface SiteContent {
  logoUrl: string;
  heroImage: string;
  aboutImage: string;
  contactImage: string;
  team: TeamContent;
  locations: LocationItem[];
  projects: PortfolioItem[];
}

export interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  // Specific helpers
  updateTeam: (teamData: Partial<TeamContent>) => void;
  updateLocation: (id: string, data: Partial<LocationItem>) => void;
  // Project management
  addProject: (project: PortfolioItem) => void;
  updateProject: (id: string, project: Partial<PortfolioItem>) => void;
  removeProject: (id: string) => void;
}
