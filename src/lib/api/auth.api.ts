import { axiosInstance } from './axiosInstance';
import { AuthResponse } from '@/types';

export const loginUser = async (data: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/signup', data);
  return response.data;
};