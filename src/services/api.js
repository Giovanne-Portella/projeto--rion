import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://inveniocenterapi.robbu.global/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orion_token');
  if (config.headers['Custom-Auth']) {
    config.headers.Authorization = config.headers['Custom-Auth'];
    delete config.headers['Custom-Auth'];
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Mantemos a assinatura que seu index.jsx já usa
  login: async (company, username, password) => {
    const AUTH_URL = 'https://api-accounts.robbu.global/v1/login';
    
    // 1. Envia com chaves MINÚSCULAS conforme seu CURL (isso conserta o erro 401)
    const { data } = await axios.post(AUTH_URL, { 
      company, 
      username, 
      password, 
      origin: null 
    }, { 
      headers: { 'Content-Type': 'application/json' } 
    });

    if (data.access_token) {
      localStorage.setItem('orion_token', data.access_token);
      
      // 2. CORREÇÃO DO NOME: Salvamos os parâmetros da função (o que foi digitado)
      // e não data.username (que provavelmente vem vazio da API)
      localStorage.setItem('orion_user', JSON.stringify({ 
        name: username, 
        company: company 
      }));
      
      // Define avatar inicial se não existir
      if (!localStorage.getItem('orion_avatar_seed')) {
        localStorage.setItem('orion_avatar_seed', username);
      }
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('orion_token');
    localStorage.removeItem('orion_user');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('orion_token');
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('orion_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const mailingService = {
  getSegments: async (page = 1) => {
    const { data } = await api.get(`/wallets?page=${page}`);
    return data.data; // Ajuste conforme estrutura real de retorno
  },
  uploadMailing: async (formData) => {
    const { data } = await api.post('/mailings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  checkStatus: async (mailingIds) => {
    // Se mailingIds for array, formata query string, senão passa direto
    let queryString = '';
    if (Array.isArray(mailingIds)) {
        const params = new URLSearchParams();
        mailingIds.forEach(id => params.append('items[]', id));
        queryString = `?${params.toString()}`;
    } else {
        // Caso seu backend aceite direto na URL
        queryString = `/${mailingIds}/status`; 
    }
    
    // Ajuste aqui conforme a rota real que estava funcionando no seu projeto
    // Baseado no seu código anterior:
    const { data } = await api.get(`/mailings/status${queryString}`);
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
  getSettings: async () => {
    const { data } = await api.get('/settings');
    return data.data;
  },
  getTemplates: async (wabaId) => {
    const { data } = await api.get(`/campaigns/whatsapp/templates?whatsapp_account_id=${wabaId}`);
    return data.data;
  }
};