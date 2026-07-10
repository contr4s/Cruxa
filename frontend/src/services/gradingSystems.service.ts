import api from './api';

export interface GradingSystemDto {
  id: string;
  name: string;
  gradeMapping: Record<string, number>; // grade name → index
}

export async function getGradingSystems(): Promise<GradingSystemDto[]> {
  const response = await api.get<GradingSystemDto[]>('/grading-systems');
  return response.data;
}

export async function getGradingSystemById(id: string): Promise<GradingSystemDto | null> {
  const response = await api.get<GradingSystemDto | null>(`/grading-systems/${id}`);
  return response.data;
}
