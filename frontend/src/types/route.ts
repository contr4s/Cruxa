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
  setterName: string;
  setterAvatarUrl?: string;
  tags: string[];
  description?: string;
  photoUrls: string[];
  rating: number;
  ascentsCount: number;
  status: RouteStatus;
  createdAt: string;
  isFavorite?: boolean;
}

export interface RouteReviewDto {
  id: string;
  routeId: string;
  userId: string;
  userName: string;
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
