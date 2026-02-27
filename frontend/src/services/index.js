import api from './api';

export const clientesService = {
  // Listar todos os clientes
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Obter cliente por ID
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Criar novo cliente
  create: async (clienteData) => {
    const response = await api.post('/clientes', clienteData);
    return response.data;
  },

  // Atualizar cliente
  update: async (id, clienteData) => {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  },

  // Deletar cliente
  delete: async (id) => {
    await api.delete(`/clientes/${id}`);
  },
};

export const fornecedoresService = {
  getAll: async () => {
    const response = await api.get('/compras/fornecedores');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/compras/fornecedores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/compras/fornecedores', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/compras/fornecedores/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/compras/fornecedores/${id}`);
  },
};

export const equipamentosService = {
  getAll: async (tipo = null) => {
    const url = tipo ? `/equipamentos?tipo=${tipo}` : '/equipamentos';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/equipamentos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/equipamentos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/equipamentos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/equipamentos/${id}`);
  },
};

export const veiculosService = {
  getAll: async (tipo = null) => {
    const url = tipo ? `/veiculos?tipo=${tipo}` : '/veiculos';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/veiculos', data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/veiculos/${id}`);
  },

  // Abastecimento
  criarAbastecimento: async (data) => {
    const response = await api.post('/veiculos/abastecimento', data);
    return response.data;
  },

  listarAbastecimentos: async () => {
    const response = await api.get('/veiculos/abastecimento');
    return response.data;
  },

  // Condutores
  criarCondutor: async (data) => {
    const response = await api.post('/veiculos/condutores', data);
    return response.data;
  },

  listarCondutores: async () => {
    const response = await api.get('/veiculos/condutores');
    return response.data;
  },
};