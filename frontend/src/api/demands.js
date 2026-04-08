import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para log de erros
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// --- Demandas ---

export const fetchDemands = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const { data } = await api.get(`/demands?${params}`);
  return data;
};

export const fetchDemand = async (id) => {
  const { data } = await api.get(`/demands/${id}`);
  return data;
};

export const createDemand = async (demand) => {
  const { data } = await api.post('/demands', demand);
  return data;
};

export const updateDemand = async ({ id, ...demand }) => {
  const { data } = await api.put(`/demands/${id}`, demand);
  return data;
};

export const updateDemandStatus = async ({ id, status }) => {
  const { data } = await api.patch(`/demands/${id}/status`, { status });
  return data;
};

export const deleteDemand = async (id) => {
  const { data } = await api.delete(`/demands/${id}`);
  return data;
};

// --- Stats ---

export const fetchStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};
