import type { ComponentType } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MapIcon from '@mui/icons-material/Map';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SearchIcon from '@mui/icons-material/Search';
import ConstructionIcon from '@mui/icons-material/Construction';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import type { UserRole } from '../../types/user';

export interface NavItem {
  path: string;
  icon?: ComponentType<{ sx?: object }>;
  label: string;
  isDivider?: boolean;
  roles?: UserRole[];
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
  { path: '/routesetter', icon: ConstructionIcon, label: 'Рутсеттер', roles: ['Routesetter'] },
  { path: '/gym-admin', icon: AdminPanelSettingsIcon, label: 'Управление', roles: ['GymAdmin'] },
  { path: '/admin', icon: AdminPanelSettingsIcon, label: 'Администрирование', roles: ['Admin'] },
];

/**
 * Список пунктов для нижней панели (без разделителей).
 */
export const TAB_ITEMS: NavItem[] = [
  { path: '/feed', icon: NewspaperIcon, label: 'Лента' },
  { path: '/workouts', icon: FitnessCenterIcon, label: 'Тренировки' },
  { path: '/gyms', icon: MapIcon, label: 'Скалодромы' },
  { path: '/profile', label: 'Профиль' },
  { path: '/routesetter', icon: ConstructionIcon, label: 'Рутсеттер', roles: ['Routesetter'] },
  { path: '/gym-admin', icon: AdminPanelSettingsIcon, label: 'Управление', roles: ['GymAdmin'] },
  { path: '/admin', icon: AdminPanelSettingsIcon, label: 'Администрирование', roles: ['Admin'] },
];
