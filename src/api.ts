import axios from 'axios';
import { Deal, Stats } from './types';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = {
  getDeals: () => axios.get<Deal[]>(`${BASE}/api/deals/`).then(r => r.data),
  getStats: () => axios.get<Stats>(`${BASE}/api/deals/stats`).then(r => r.data),
  createDeal: (data: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) =>
    axios.post<Deal>(`${BASE}/api/deals/`, data).then(r => r.data),
  updateDeal: (id: number, data: Partial<Deal>) =>
    axios.patch<Deal>(`${BASE}/api/deals/${id}`, data).then(r => r.data),
  deleteDeal: (id: number) =>
    axios.delete(`${BASE}/api/deals/${id}`).then(r => r.data),
};

export const WS_URL = BASE.replace('http', 'ws') + '/ws';
