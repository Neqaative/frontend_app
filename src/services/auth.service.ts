import apiClient from './apiClient';
import { SignUpDto, SignInDto, Tokens } from '../types/auth.types';

export const authService = {
  signup: async (dto: SignUpDto): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/local/signup', dto);
    return data;
  },

  signin: async (dto: SignInDto): Promise<Tokens> => {
    const { data } = await apiClient.post('/auth/local/signin', dto);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return data;
  },

  refreshToken: async (): Promise<Tokens> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const { data } = await apiClient({
      method: 'POST',
      url: '/auth/refresh',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return data;
  },
};
