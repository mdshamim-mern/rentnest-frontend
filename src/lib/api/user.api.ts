import { axiosInstance } from './axiosInstance';

export const getUserProfile = async (userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await axiosInstance.put(`/users/${userId}`, data);
  return response.data;
};

export const getAdminInfo = async () => {
  const response = await axiosInstance.get('/users/admin-info');
  return response.data;
};