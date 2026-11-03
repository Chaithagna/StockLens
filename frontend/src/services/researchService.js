import api from './api.js';

export const researchService = {
  async initiate(data) {
    const res = await api.post('/research', data);
    return res.data?.report;
  },

  async getById(id) {
    const res = await api.get(`/research/${id}`);
    return res.data?.report;
  },

  async getHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/research/history?${query}`);
    return res;
  },

  async deleteReport(id) {
    const res = await api.delete(`/research/${id}`);
    return res.success;
  },

  async getDashboardStats() {
    const res = await api.get('/research/dashboard-stats');
    return res.data;
  },

  async compare(reportIds) {
    const res = await api.post('/research/compare', { reportIds });
    return res.data;
  },
};

