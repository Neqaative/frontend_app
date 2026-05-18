import apiClient from './apiClient';
import { User } from '../types/user.types';

interface UpdateUserDto extends Partial<User> {}

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordDto {
  newPassword: string;
}

export const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get('/user/me');
    return data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/user/all');
    return data;
  },

  getActiveUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/user/active');
    return data;
  },

  getInactiveUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/user/inactive');
    return data;
  },

  updateUser: async (userId: number, dto: UpdateUserDto): Promise<User> => {
    const { data } = await apiClient.patch(`/user/${userId}`, dto);
    return data;
  },

  // Self-service: uses JWT identity — no userId in URL
  changePassword: async (_userId: number, dto: ChangePasswordDto): Promise<{ message: string }> => {
    const { data } = await apiClient.patch('/user/me/change-password', dto);
    return data;
  },

  resetPassword: async (userId: number, dto: ResetPasswordDto): Promise<{ message: string }> => {
    const { data } = await apiClient.patch(`/user/${userId}/reset-password`, dto);
    return data;
  },

  changeUserRole: async (userId: number, role: string): Promise<User> => {
    const { data } = await apiClient.patch(`/user/${userId}/role`, { role });
    return data;
  },

  activateUser: async (userId: number): Promise<User> => {
    const { data } = await apiClient.patch(`/user/${userId}/activate`);
    return data;
  },
};
