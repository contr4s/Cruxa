import type { RouteType } from './route';

export type PostVisibility = 'Public' | 'Followers' | 'Private';
export type AscentStyle = 'Flash' | 'Onsight' | 'Redpoint' | 'Attempt' | 'Project' | 'Repeat';

export interface PostDto {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatarUrl?: string;
  gymId?: string;
  gymName?: string;
  body?: string;
  mediaUrls: string[];
  visibility: PostVisibility;
  stats: PostStats;
  ascents: PostAscentDto[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostStats {
  totalKruskor: number;
  avgGrade: string;
  duration?: number; // minutes
  totalRoutes: number;
  maxGrade?: string;
}

export interface PostAscentDto {
  id: string;
  routeId: string;
  routeName: string;
  grade: string;
  gradeIndex?: number;
  holdColor: string;
  style: AscentStyle;
  type?: RouteType;
  isFlash?: boolean;
  notes?: string;
  mediaUrls?: string[];
  tags?: { name: string; category: string }[];
}

export interface CommentDto {
  id: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface PostDetailDto extends PostDto {
  likedBy: LikedUserDto[];
}

export interface LikedUserDto {
  username: string;
  id: string;
  displayName: string;
  userAvatarUrl?: string;
}

export interface CreatePostRequest {
  gymId?: string;
  body?: string;
  mediaUrls: string[];
  visibility: PostVisibility;
  duration?: number;
  ascents: CreateAscentRequest[];
}

export interface CreateAscentRequest {
  routeId: string;
  style: AscentStyle;
  notes?: string;
}

// Feed
export type FeedFilter = 'subs' | 'recommended';

export interface RecommendedUserDto {
  username: string;
  id: string;
  displayName: string;
  userAvatarUrl?: string;
  commonFollowers: number;
  isFollowed: boolean;
}

export interface RecommendedRouteDto {
  id: string;
  name: string;
  grade: string;
  holdColor: string;
  rating: number;
  gymName: string;
  gymId: string;
}

export interface RecommendedGymDto {
  id: string;
  name: string;
  rating: number;
  lat?: number;
  lon?: number;
  area?: number;
  maxHeight?: number;
  activeRouteCount?: number;
}

export interface FeedSuggestionsDto {
  users: RecommendedUserDto[];
  routes: RecommendedRouteDto[];
  gyms: RecommendedGymDto[];
}
