import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAppToken = (): string | null => {
  return localStorage.getItem('appToken');
};

export const refreshToken = async () => {
  try {
    const clerkToken = await window.Clerk.session.getToken();

    const response = await axios.post(
      `${API_BASE_URL}/auth/session`,
      { clerkToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data && response.data.token) {
      localStorage.setItem('appToken', response.data.token);
      // console.log('Token refreshed successfully');
      return response.data.token;
    } else {
      throw new Error('Token refresh failed: No token in response');
    }
  } catch (error) {
    // console.error('Error refreshing token:', error);
    throw error;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const axiosConfig = config as AxiosRequestConfig & {
      requiresAuth?: boolean;
    };
    if (axiosConfig.headers && axiosConfig.requiresAuth) {
      const token = getAppToken();
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
        // console.log('Adding auth token to request:', config.url);
      } else {
        // console.warn(
        //   'Application token not found for protected request.',
        //   config.url,
        // );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message?.includes('expired') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // console.error('Token refresh failed, redirecting to login');
        localStorage.removeItem('appToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const getAppSessionToken = async (
  clerkToken: string,
): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/session`,
      { clerkToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error: any) {
    // console.error(
    //   'Error, cannot take token.',
    //   error.response?.data || error.message || error,
    // );
    throw error;
  }
};

export const customRegister = async (userData: any): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.post('/auth/custom-register', userData);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const fetchGames = async (
  queryParams: string = '',
): Promise<AxiosResponse> => {
  const response = await apiClient.get(`/games${queryParams}`, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const fetchGameById = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.get(`/games/${id}`, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const createGameApi = async (gameData: any): Promise<AxiosResponse> => {
  const response = await apiClient.post('/games', gameData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const updateGameApi = async (
  id: string,
  gameData: any,
): Promise<AxiosResponse> => {
  const response = await apiClient.put(`/games/${id}`, gameData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const deleteGameApi = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.delete(`/games/${id}`, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const fetchCategories = async (): Promise<AxiosResponse> => {
  const response = await apiClient.get('/categories');
  return response;
};
export const getCategoryById = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.get(`/categories/${id}`);
  return response;
};
export const createCategoryApi = async (
  categoryData: any,
): Promise<AxiosResponse> => {
  const response = await apiClient.post('/categories', categoryData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const updateCategoryApi = async (
  id: string,
  categoryData: any,
): Promise<AxiosResponse> => {
  const response = await apiClient.put(`/categories/${id}`, categoryData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const deleteCategoryApi = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.delete(`/categories/${id}`, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const fetchPlatforms = async (): Promise<AxiosResponse> => {
  const response = await apiClient.get('/platforms');
  return response;
};
export const getPlatformById = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.get(`/platforms/${id}`);
  return response;
};
export const createPlatformApi = async (
  platformData: any,
): Promise<AxiosResponse> => {
  const response = await apiClient.post('/platforms', platformData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const updatePlatformApi = async (
  id: string,
  platformData: any,
): Promise<AxiosResponse> => {
  const response = await apiClient.put(`/platforms/${id}`, platformData, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const deletePlatformApi = async (id: string): Promise<AxiosResponse> => {
  const response = await apiClient.delete(`/platforms/${id}`, {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
export const fetchDashboardSummary = async (): Promise<AxiosResponse> => {
  const response = await apiClient.get('/dashboard/summary', {
    requiresAuth: true,
  } as AxiosRequestConfig & { requiresAuth?: boolean });
  return response;
};
