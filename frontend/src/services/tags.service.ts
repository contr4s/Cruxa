const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface TagInfo {
  name: string;
  category: string;
}

export async function getTags(): Promise<TagInfo[]> {
  if (USE_MOCK) {
    const { mockGetTags } = await import('./mock/tags.mock');
    return mockGetTags();
  }
  const { default: api } = await import('./api');
  const response = await api.get<TagInfo[]>('/tags');
  return response.data;
}
