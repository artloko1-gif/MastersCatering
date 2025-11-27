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
  id: string; // Added ID for editing/deleting
  title: string;
  client?: string;
  date?: string;
  guests?: number;
  location?: string;
  description: string;
  imageUrls: string[]; // Changed from single string to array
  tags: string[];
}

export interface LocationItem {
  title: string;
  description: string;
  imageUrl: string;
  icon: LucideIcon;
}

export interface SiteContent {
  heroImage: string;
  aboutImage: string;
  projects: PortfolioItem[];
}

export interface ContentContextType {
  content: SiteContent;
  updateGlobalImages: (hero: string, about: string) => void;
  addProject: (project: PortfolioItem) => void;
  removeProject: (id: string) => void;
}