export interface GymDto {
  id: string;
  name: string;
  city: string;
  address: string;
  lat?: number;
  lon?: number;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  vkUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  photoUrls: string[];
  area?: number;
  maxHeight?: number;
  yearOpened?: number;
  metroStations: string[];
  tags: string[];
  hours: GymHours;
  prices: GymPrice[];
  rating: number;
  routeCount: number;
  activeRouteCount: number;
  isFavorite: boolean;
  distance?: string;
}

export interface GymHours {
  [day: string]: string;
}

export interface GymPrice {
  name: string;
  price: number;
}

export interface GymSector {
  id: string;
  name: string;
  gymId: string;
}
