import api from './api';

export interface TagInfo {
  name: string;
  category: string;
}

export async function getTags(): Promise<TagInfo[]> {
  const response = await api.get<TagInfo[]>('/tags');
  return response.data;
}
