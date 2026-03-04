export type UserRole = 'guest' | 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface MapPoint {
  id: string;
  label: string;
  x: number; // % от ширины SVG
  y: number; // % от высоты SVG
  section: string;
  path: string;
  description: string;
  isPrimary?: boolean;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  section: string;
  publishedAt: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  period?: string;
}

export interface Route {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  articlesCount: number;
  duration: string; // напр. "30 мин"
}

export interface Test {
  id: number;
  title: string;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completions: number;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface BiographyPeriod {
  id: string;
  title: string;
  years: string;
  location: string;
  description: string;
  mapPointId?: string;
}
