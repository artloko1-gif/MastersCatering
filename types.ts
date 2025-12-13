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
  imageUrls: string[]; // Changed from imageUrl to support gallery
}

export interface TeamContent {
  teamImage: string;
  managerImage: string;
  managerName: string;
  managerRole: string;
  managerQuote: string;
  teamMotto: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  eventType: string;
  guests: number;
  dateLocation: string;
  email: string;
  requirements: string;
  status: 'new' | 'solved' | 'irrelevant';
}

export interface ClientItem {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface TextContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  aboutTitle?: string;
  aboutDescription?: string;
}

export interface SiteContent {
  faviconUrl?: string;
  logoUrl: string;
  logoDarkBgUrl?: string;
  logoLightBgUrl?: string;
  heroImage: string; // Deprecated, kept for backward compatibility type safety
  heroImages: string[]; // New: Array of images for slideshow
  aboutImage: string;
  contactImage: string;
  team: TeamContent;
  locations: LocationItem[];
  projects: PortfolioItem[];
  clients: ClientItem[];
  textContent?: TextContent;
  inquiries?: Inquiry[];
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
  // Client management
  addClient: (client: ClientItem) => void;
  updateClient: (id: string, data: Partial<ClientItem>) => void;
  removeClient: (id: string) => void;
  reorderClients: (newOrder: ClientItem[]) => void;
  // Inquiry management
  addInquiry: (inquiry: Inquiry) => Promise<void>;
  updateInquiry: (id: string, status: 'new' | 'solved' | 'irrelevant') => void;
  removeInquiry: (id: string) => void;
  // Cloud Ops
  saveToCloud: () => Promise<void>;
}