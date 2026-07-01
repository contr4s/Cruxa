export interface AdminDashboardStats {
  totalGyms: number;
  totalRoutes: number;
  totalSetters: number;
  monthlyAscents: number;
}

export interface RecentActivityItem {
  gymId: string;
  gymName: string;
  event: string;
  timestamp: string;
  isOnline: boolean;
}

export interface TopGymItem {
  gymId: string;
  gymName: string;
  ascentsCount: number;
}

export interface AdminGymItem {
  id: string;
  name: string;
  city: string;
  routeCount: number;
  setterCount: number;
  rating: number;
  monthlyAscents: number;
  status: 'Active' | 'Pending' | 'Blocked';
}

export interface AdminGymFilterState {
  city: string;
  status: 'all' | 'Active' | 'Pending' | 'Blocked';
  sort: string;
}
