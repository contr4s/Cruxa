import api from './api';

export interface DevAccountDto {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  gymNames: string[] | null;
}

export interface DevLoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    displayName: string;
    avatarUrl: string | null;
    city: string | null;
    gender: string | null;
    height: number | null;
    role: string;
  };
}

export async function getDevAccounts(): Promise<DevAccountDto[]> {
  const response = await api.get<DevAccountDto[]>('/dev/accounts');
  return response.data;
}

export async function devLogin(id: string): Promise<DevLoginResponse> {
  const response = await api.get<DevLoginResponse>(`/dev/login/${id}`);
  return response.data;
}
