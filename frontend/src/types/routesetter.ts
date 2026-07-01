export interface RoutesetterStats {
  activeRoutes: number;
  averageRating: number;
  totalAscents: number;
}

export interface QuickOverview {
  mostPopularRoute: {
    id: string;
    name: string;
    grade: string;
    ascentsCount: number;
  } | null;
  highestRatedRoute: {
    id: string;
    name: string;
    grade: string;
    rating: number;
  } | null;
  newThisWeek: number;
}

export interface SetterRouteFilterState {
  searchQuery: string;
  type: string;
  holdColor: string;
  minGradeIndex: number;
  maxGradeIndex: number;
  sort: string;
  status: 'all' | 'Active' | 'Archived';
  gymId: string;
  minRating: number;
  maxRating: number;
  minAscents: number;
  maxAscents: number;
  createdWithin: number;
  tags: string;
}

export interface RouteReviewSummary {
  id: string;
  routeId: string;
  routeName: string;
  routeGrade: string;
  userId: string;
  displayName: string;
  userAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LinkedGymSummary {
  id: string;
  name: string;
  city: string;
  address: string;
  activeRouteCount: number;
  rating: number;
}
