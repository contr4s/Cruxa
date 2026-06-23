import type { ComponentType } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MapIcon from '@mui/icons-material/Map';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SearchIcon from '@mui/icons-material/Search';

export interface NavItem {
  path: string;
  icon?: ComponentType<{ sx?: object }>;
  label: string;
  isDivider?: boolean;
}

/**
 * Единый список пунктов навигации.
 * Используется в Sidebar (desktop) и BottomTabBar (mobile).
 */
export const NAV_ITEMS: NavItem[] = [
  { path: '/profile', label: 'Профиль' },
  { path: '', icon: SearchIcon, label: 'Поиск', isDivider: true },
  { path: '/workouts', icon: FitnessCenterIcon, label: 'Тренировки' },
  { path: '/gyms', icon: MapIcon, label: 'Скалодромы' },
  { path: '/feed', icon: NewspaperIcon, label: 'Лента' },
];

/**
 * Список пунктов для нижней панели (без разделителей).
 */
export const TAB_ITEMS: NavItem[] = [
  { path: '/profile', label: 'Профиль' },
  { path: '/workouts', icon: FitnessCenterIcon, label: 'Тренировки' },
  { path: '/gyms', icon: MapIcon, label: 'Скалодромы' },
  { path: '/feed', icon: NewspaperIcon, label: 'Лента' },
];
