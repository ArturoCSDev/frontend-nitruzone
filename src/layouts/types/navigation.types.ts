import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface SidebarProps {
  className?: string;
}

export interface HeaderProps {
  className?: string;
}
