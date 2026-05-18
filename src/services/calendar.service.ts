import apiClient from './apiClient';
import { CalendarEvent, CreateEventDto, UpdateEventDto } from '../types/calendar.types';

export const calendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    const response = await apiClient.get('/calendar/events');
    return response.data;
  },

  getUserEvents: async (userId: number): Promise<CalendarEvent[]> => {
    const response = await apiClient.get(`/calendar/events/user/${userId}`);
    return response.data;
  },

  getEventsByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    const response = await apiClient.get(`/calendar/events/range?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  getUserEventsByDateRange: async (userId: number, startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    const response = await apiClient.get(`/calendar/events/range/user/${userId}?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  getEvent: async (eventIndex: number): Promise<CalendarEvent> => {
    const response = await apiClient.get(`/calendar/events/${eventIndex}`);
    return response.data;
  },

  createEvent: async (data: CreateEventDto): Promise<CalendarEvent> => {
    const response = await apiClient.post('/calendar/events', data);
    return response.data;
  },

  updateEvent: async (eventIndex: number, data: UpdateEventDto): Promise<CalendarEvent> => {
    const response = await apiClient.put(`/calendar/events/${eventIndex}`, data);
    return response.data;
  },

  deleteEvent: async (eventIndex: number): Promise<void> => {
    await apiClient.delete(`/calendar/events/${eventIndex}`);
  },
};
