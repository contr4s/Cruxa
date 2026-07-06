import api from './api';

/**
 * Upload a single media file. Returns the URL of the uploaded file.
 * Backend endpoint: POST /api/media/upload
 */
export async function uploadMedia(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<{ url: string }>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
