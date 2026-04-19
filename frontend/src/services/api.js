import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student API
export const studentAPI = {
  register: (data) => api.post('/students/register', data),
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.put(`/students/${id}`, data),
  getAllocationStatus: (id) => api.get(`/students/${id}/allocation-status`),
  applyForRoom: (id, data) => api.post(`/students/${id}/apply-room`, data),
};

// Admin API
export const adminAPI = {
  register: (data) => api.post('/admins/register', data),
  getAll: () => api.get('/admins'),
  getById: (id) => api.get(`/admins/${id}`),
  update: (id, data) => api.put(`/admins/${id}`, data),
};

// Hostel API
export const hostelAPI = {
  create: (data) => api.post('/hostels', data),
  getAll: () => api.get('/hostels'),
  getById: (id) => api.get(`/hostels/${id}`),
  update: (id, data) => api.put(`/hostels/${id}`, data),
  delete: (id) => api.delete(`/hostels/${id}`),
};

// Room API
export const roomAPI = {
  create: (data) => api.post('/rooms', data),
  getAll: () => api.get('/rooms'),
  getAvailable: () => api.get('/rooms/available'),
  getById: (id) => api.get(`/rooms/${id}`),
  getByHostel: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
  getAvailableByHostel: (hostelId) => api.get(`/rooms/hostel/${hostelId}/available`),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Allocation API
export const allocationAPI = {
  allocate: (studentId, data) => api.post(`/allocations/${studentId}`, data),
  getAll: () => api.get('/allocations'),
  getById: (id) => api.get(`/allocations/${id}`),
  getStatus: (studentId) => api.get(`/allocations/student/${studentId}/status`),
};

export default api;
