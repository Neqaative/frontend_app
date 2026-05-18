import apiClient from './apiClient';
import { Work, CreateWorkDto, UpdateWorkDto } from '../types/work.types';

export const workService = {
  getAllWorks: async (): Promise<Work[]> => {
    const { data } = await apiClient.get('/works/all');
    return data;
  },

  getWork: async (id: number): Promise<Work> => {
    const { data } = await apiClient.get(`/works/${id}`);
    return data;
  },

  createWork: async (dto: CreateWorkDto): Promise<Work> => {
    const { data } = await apiClient.post('/works/create', dto);
    return data;
  },

  updateWork: async (id: number, dto: UpdateWorkDto): Promise<Work> => {
    const { data } = await apiClient.patch(`/works/${id}`, dto);
    return data;
  },

  deleteWork: async (id: number): Promise<Work> => {
    const { data } = await apiClient.delete(`/works/${id}`);
    return data;
  },
};
