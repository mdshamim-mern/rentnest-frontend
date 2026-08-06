import { axiosInstance } from './axiosInstance';

export const saveSearch = async (data: any) => {
  try {
    const response = await axiosInstance.post('/saved-searches', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save search');
  }
};

export const getSavedSearches = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/saved-searches?userId=${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch saved searches');
  }
};

export const deleteSavedSearch = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/saved-searches/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete saved search');
  }
};