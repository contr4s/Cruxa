export interface GymAdminStats {
  totalRoutes: number;
  activeRoutes: number;
  averageRating: number;
  totalAscents: number;
}

export interface GymActivity {
  newRoutes: number;
  ascents: number;
  reviews: number;
  visitors: number;
  period: string;
}

export interface AdminRouteFilterState {
  searchQuery: string;
  type: string;
  holdColor: string;
  minGradeIndex: number;
  maxGradeIndex: number;
  sort: string;
  status: 'all' | 'Active' | 'Archived';
  sector: string;
  setterId: string;
  minRating: number;
  maxRating: number;
  minAscents: number;
  maxAscents: number;
  createdWithin: number;
  tags: string;
}

export interface SetterManagementItem {
  id: string;
  name: string;
  avatarUrl?: string;
  activeRoutes: number;
  averageRating: number;
  email?: string;
}
