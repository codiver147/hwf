
import axios from 'axios';
import authApi from './authService';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with authentication interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = authApi.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', `Bearer ${token.substring(0, 10)}...`);
    } else {
      console.warn('No auth token available for request to:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`API Error from ${error.config?.url}:`, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Clients API
export const clientsApi = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  create: async (clientData: any) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  update: async (id: number, clientData: any) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }
};

// Volunteers API
export const volunteersApi = {
  getAll: async () => {
    const response = await api.get('/volunteers');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data;
  },
  create: async (volunteerData: any) => {
    const response = await api.post('/volunteers', volunteerData);
    return response.data;
  },
  update: async (id: number, volunteerData: any) => {
    const response = await api.put(`/volunteers/${id}`, volunteerData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/volunteers/${id}`);
    return response.data;
  }
};

// Skills API
export const skillsApi = {
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data;
  },
  getVolunteerSkills: async () => {
    const response = await api.get('/skills/volunteer');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },
  create: async (skillData: any) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },
  update: async (id: number, skillData: any) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  }
};

// Inventory API
export const inventoryApi = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  create: async (itemData: any) => {
    const response = await api.post('/inventory', itemData);
    return response.data;
  },
  update: async (id: number, itemData: any) => {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
  getAllCategories: async () => {
    const response = await api.get('/inventory/categories/all');
    return response.data;
  }
};

// Teams API
export const teamsApi = {
  getAll: async () => {
    const response = await api.get('/teams');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },
  create: async (teamData: any) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },
  update: async (id: number, teamData: any) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  }
};

// Requests API
export const requestsApi = {
  getAll: async () => {
    const response = await api.get('/requests');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },
  create: async (requestData: any) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },
  update: async (id: number, requestData: any) => {
    const response = await api.put(`/requests/${id}`, requestData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  }
};

// Test database connection
export const testDbConnection = async () => {
  try {
    const response = await api.get('/test-db');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
