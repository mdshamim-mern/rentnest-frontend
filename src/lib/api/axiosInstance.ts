import axios from 'axios';

import { useAuthStore } from '../store/authStore';



export const axiosInstance = axios.create({

  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://rentnest-backend-iota.vercel.app/api",
  timeout: 20000,

  headers: {

    'Content-Type': 'application/json',

  },

});



axiosInstance.interceptors.request.use(

  (config) => {

    const token = useAuthStore.getState().token;

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);



axiosInstance.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {

      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {

        window.location.href = '/login';

      }

    }

    return Promise.reject(error);

  }

);