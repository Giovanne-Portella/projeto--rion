import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://inveniocenterapi.robbu.global/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orion_token');
  // Se a requisição tiver um header "Custom-Auth", usamos ele (Private Token), senão usa o Bearer do login
  if (config.headers['Custom-Auth']) {
    config.headers.Authorization = config.headers['Custom-Auth'];
    delete config.headers['Custom-Auth']; // Remove o auxiliar
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (company, username, password) => {
    const AUTH_URL = 'https://api-accounts.robbu.global/v1/login';
    const { data } = await axios.post(AUTH_URL, { company, username, password, origin: null }, 
      { headers: { 'Content-Type': 'application/json' } });
    if (data.access_token) {
      localStorage.setItem('orion_token', data.access_token);
      localStorage.setItem('orion_user', JSON.stringify({ name: data.username, company: data.company_destination }));
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem('orion_token');
    window.location.href = '/login';
  }
};

export const mailingService = {
  getSegments: async (page = 1) => {
    const { data } = await api.get(`/wallets?page=${page}`);
    return data.data;
  },
  uploadMailing: async (formData) => {
    const { data } = await api.post('/mailings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  checkStatus: async (mailingIds) => {
    const params = new URLSearchParams();
    mailingIds.forEach(id => params.append('items[]', id));
    const { data } = await api.get(`/mailings/status?${params.toString()}`);
    return data.data;
  }
};

export const configService = {
  getWABAs: async () => {
    const { data } = await api.get('/settings/channels/whatsapp-accounts');
    return data.data;
  },
  getLines: async (wabaId) => {
    const { data } = await api.get(`/settings/channels/whatsapp?whatsapp_account_id=${wabaId}&prospect=false`);
    return data.data;
  },
  // NOVA FUNÇÃO: Obter Private Token
  getSettings: async () => {
    const { data } = await api.get('/settings');
    return data.data; // Retorna o objeto contendo "private_token"
  },

  getTemplates: async (wabaId) => {
    // Apenas o endpoint, sem o /v1
    const { data } = await api.get(`/campaigns/whatsapp/templates?whatsapp_account_id=${wabaId}`);
    return data.data;
  }
};
