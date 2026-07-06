export type RouteType = 'Boulder' | 'Lead' | 'TopRope' | 'Speed';
export type RouteStatus = 'Active' | 'Archived';

export interface RouteDto {
  id: string;
  name: string;
  grade: string;
  gradeIndex: number;
  type: RouteType;
  holdColor: string;
  sector?: string;
  gymId: string;
  gymName: string;
  setterId: string;
  setterUsername: string;
  setterName: string;
  setterAvatarUrl?: string;
  setterGender?: 'male' | 'female';
  tags: string[];
  description?: string;
  photoUrls: string[];
  rating: number;
  ascentsCount: number;
  status: RouteStatus;
  createdAt: string;
}

export interface RouteReviewDto {
  id: string;
  routeId: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface GradeConsensus {
  routeId: string;
  gradeDistribution: GradeVoteCount[];
  consensusGrade: string;
  consensusGradeIndex: number;
  totalVotes: number;
  userVote?: number;
}

export interface GradeVoteCount {
  grade: string;
  gradeIndex: number;
  count: number;
}

export interface CreateRoutePayload {
  gymId: string;
  name: string;
  gradeRaw: string;
  type: RouteType;
  holdColor: string;
  sector?: string;
  tags?: string[];
  description?: string;
  photoUrls?: string[];
  isActive?: boolean;
  setterId?: string;
}

export interface UpdateRoutePayload {
  name?: string;
  gradeRaw?: string;
  type?: RouteType;
  holdColor?: string;
  sector?: string | null;
  tags?: string[];
  description?: string | null;
  photoUrls?: string[];
  isActive?: boolean;
  setterId?: string;
}
