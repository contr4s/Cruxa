export type PostVisibility = 'Public' | 'Followers' | 'Private';
export type AscentStyle = 'Flash' | 'Onsight' | 'Redpoint' | 'Attempt' | 'Project' | 'Repeat';

export interface PostDto {
  id: string;
  userId: string;
  userName: string;
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
  isBookmarked: boolean;
  createdAt: string;
}

export interface PostStats {
  totalKruskor: number;
  avgGrade: string;
  duration?: number; // minutes
  totalRoutes: number;
}

export interface PostAscentDto {
  id: string;
  routeId: string;
  routeName: string;
  grade: string;
  holdColor: string;
  style: AscentStyle;
  isFlash?: boolean;
  notes?: string;
}

export interface CommentDto {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  createdAt: string;
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
