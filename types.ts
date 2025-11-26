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
  title: string;
  client?: string;
  date?: string;
  guests?: number;
  location?: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface LocationItem {
  title: string;
  description: string;
  imageUrl: string;
  icon: LucideIcon;
}