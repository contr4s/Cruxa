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
  socialLinks?: string[];
  photoUrls: string[];
  wallArea?: number;
  maxHeight?: number;
  yearFounded?: number;
  metroStations: string[];
  tags: string[];
  hours: WorkingHoursEntry[];
  prices: GymPrice[];
  rating: number;
  routeCount: number;
  activeRouteCount: number;
  isFavorite: boolean;
}

export interface GymPrice {
  name: string;
  price: string;
}

export interface GymSector {
  id: string;
  name: string;
  gymId: string;
}

export interface WorkingHoursEntry {
  days: string;
  from: string;
  to: string;
}

export interface UpdateGymPayload {
  name?: string;
  city?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  socialLinks?: string[];
  photoUrls?: string[];
  area?: number | null;
  maxHeight?: number | null;
  yearOpened?: number | null;
  metroStations?: string[];
  tags?: string[];
  hours?: WorkingHoursEntry[];
  prices?: GymPrice[];
}

export interface BulkImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}
