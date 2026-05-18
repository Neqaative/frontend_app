import apiClient from './apiClient';
import { WorkSchedule, CreateScheduleDto, CreateStageDto, CreateTaskDto } from '../types/schedule.types';

export const scheduleService = {
  getAllSchedules: async (): Promise<WorkSchedule[]> => {
    const { data } = await apiClient.get('/schedules');
    return data;
  },

  getScheduleByWorkId: async (workId: number): Promise<WorkSchedule> => {
    const { data } = await apiClient.get(`/schedules/${workId}`);
    return data;
  },

  createSchedule: async (dto: CreateScheduleDto): Promise<WorkSchedule> => {
    const { data } = await apiClient.post('/schedules', dto);
    return data;
  },

  deleteSchedule: async (workId: number): Promise<void> => {
    await apiClient.delete(`/schedules/${workId}`);
  },

  addStage: async (workId: number, dto: CreateStageDto): Promise<WorkSchedule> => {
    const { data } = await apiClient.post(`/schedules/${workId}/stages`, dto);
    return data;
  },

  updateStage: async (workId: number, stageIndex: number, dto: CreateStageDto): Promise<WorkSchedule> => {
    const { data } = await apiClient.patch(`/schedules/${workId}/stages/${stageIndex}`, dto);
    return data;
  },

  deleteStage: async (workId: number, stageIndex: number): Promise<void> => {
    await apiClient.delete(`/schedules/${workId}/stages/${stageIndex}`);
  },

  addTask: async (workId: number, stageIndex: number, dto: CreateTaskDto): Promise<WorkSchedule> => {
    const { data } = await apiClient.post(`/schedules/${workId}/stages/${stageIndex}/tasks`, dto);
    return data;
  },

  updateTask: async (workId: number, stageIndex: number, taskIndex: number, dto: CreateTaskDto): Promise<WorkSchedule> => {
    const { data } = await apiClient.patch(`/schedules/${workId}/stages/${stageIndex}/tasks/${taskIndex}`, dto);
    return data;
  },

  deleteTask: async (workId: number, stageIndex: number, taskIndex: number): Promise<void> => {
    await apiClient.delete(`/schedules/${workId}/stages/${stageIndex}/tasks/${taskIndex}`);
  },

  toggleTaskCompletion: async (workId: number, stageIndex: number, taskIndex: number): Promise<WorkSchedule> => {
    const { data } = await apiClient.patch(`/schedules/${workId}/stages/${stageIndex}/tasks/${taskIndex}/toggle`);
    return data;
  },
};
