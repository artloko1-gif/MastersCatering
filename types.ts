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
  // Icon is handled by component mapping to avoid serialization issues
}

export interface SiteContent {
  logoUrl: string;
  heroImage: string;
  aboutImage: string;
  teamImage: string;
  managerImage: string;
  contactImage: string;
  locations: LocationItem[];
  projects: PortfolioItem[];
}

export interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  updateGlobalImages: (hero: string, about: string) => void; // Keep for backward compatibility or refactor
  addProject: (project: PortfolioItem) => void;
  removeProject: (id: string) => void;
}
