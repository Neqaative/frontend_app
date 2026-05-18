import apiClient from './apiClient';
import { Client, CreateClientDto } from '../types/client.types';

export const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    const { data } = await apiClient.get('/client/all');
    return data;
  },

  getClient: async (id: number): Promise<Client> => {
    const { data } = await apiClient.get(`/client/${id}`);
    return data;
  },

  createClient: async (dto: CreateClientDto): Promise<Client> => {
    const { data } = await apiClient.post('/client/create', dto);
    return data;
  },

  updateClient: async (id: number, dto: Partial<CreateClientDto>): Promise<Client> => {
    const { data } = await apiClient.patch(`/client/${id}`, dto);
    return data;
  },

  deleteClient: async (id: number): Promise<Client> => {
    const { data } = await apiClient.delete(`/client/${id}`);
    return data;
  },
};
