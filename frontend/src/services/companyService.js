import api from './api.js';

export const companyService = {
  async search(query = '') {
    const res = await api.get(`/companies/search?q=${encodeURIComponent(query)}`);
    return res.data?.companies || [];
  },

  async getById(id) {
    const res = await api.get(`/companies/${id}`);
    return res.data?.company;
  },
};

