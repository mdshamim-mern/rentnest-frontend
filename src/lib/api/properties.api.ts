import { axiosInstance } from './axiosInstance';
import { ApiResponse, Property, Category } from '@/types';

export const getAllProperties = async (params?: Record<string, any>): Promise<ApiResponse<Property[]>> => {
  const response = await axiosInstance.get('/properties', { params });
  return response.data;
};

export const getPropertyById = async (id: string): Promise<ApiResponse<Property>> => {
  const response = await axiosInstance.get(`/properties/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const createProperty = async (data: any): Promise<ApiResponse<Property>> => {
  const response = await axiosInstance.post('/properties', data);
  return response.data;
};