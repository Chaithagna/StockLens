import api from './api.js';

export const assistantService = {
  async sendMessage(researchId, message) {
    const res = await api.post(`/assistant/${researchId}/message`, { message });
    return res.data;
  },

  async getConversation(researchId) {
    const res = await api.get(`/assistant/${researchId}`);
    return res.data?.conversation;
  },
};

