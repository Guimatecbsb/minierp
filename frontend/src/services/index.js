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

export const eventosService = {
  getAll: async (status = null, data_inicio = null, data_fim = null) => {
    let url = '/eventos';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (data_inicio) params.push(`data_inicio=${data_inicio}`);
    if (data_fim) params.push(`data_fim=${data_fim}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/eventos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/eventos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/eventos/${id}`);
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export const relatoriosService = {
  downloadPDF: async (tipo) => {
    const response = await api.get(`/relatorios/${tipo}/pdf`, {
      responseType: 'blob',
    });
    
    // Criar download automático
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_${tipo}_${new Date().getTime()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export const backupService = {
  getStats: async () => {
    const response = await api.get('/backup/stats');
    return response.data;
  },

  exportBackup: async () => {
    const response = await api.get('/backup/export', {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_${new Date().getTime()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  restoreBackup: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/backup/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export const comprasService = {
  // Ordens de Compra
  criarOrdem: async (data) => {
    const response = await api.post('/compras/ordens', data);
    return response.data;
  },

  listarOrdens: async () => {
    const response = await api.get('/compras/ordens');
    return response.data;
  },

  // Orçamentos
  criarOrcamento: async (data) => {
    const response = await api.post('/compras/orcamentos', data);
    return response.data;
  },

  listarOrcamentos: async (status = null) => {
    const url = status ? `/compras/orcamentos?status=${status}` : '/compras/orcamentos';
    const response = await api.get(url);
    return response.data;
  },
};

export const estoqueService = {
  // Empréstimos
  criarEmprestimo: async (data) => {
    const response = await api.post('/estoque/emprestimos', data);
    return response.data;
  },

  listarEmprestimos: async (tipo = null, status = null) => {
    let url = '/estoque/emprestimos';
    const params = [];
    if (tipo) params.push(`tipo=${tipo}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // EPIs
  criarEPI: async (data) => {
    const response = await api.post('/estoque/epis', data);
    return response.data;
  },

  listarEPIs: async (status = null) => {
    const url = status ? `/estoque/epis?status=${status}` : '/estoque/epis';
    const response = await api.get(url);
    return response.data;
  },

  alertasEPIs: async () => {
    const response = await api.get('/estoque/epis/alertas');
    return response.data;
  },
};

export const operacionalService = {
  // Atividades
  criarAtividade: async (data) => {
    const response = await api.post('/operacional/atividades', data);
    return response.data;
  },

  listarAtividades: async (tipo = null) => {
    const url = tipo ? `/operacional/atividades?tipo=${tipo}` : '/operacional/atividades';
    const response = await api.get(url);
    return response.data;
  },

  // Camarins
  criarCamarin: async (data) => {
    const response = await api.post('/operacional/camarins', data);
    return response.data;
  },

  listarCamarins: async (status = null) => {
    const url = status ? `/operacional/camarins?status=${status}` : '/operacional/camarins';
    const response = await api.get(url);
    return response.data;
  },

  // Ar Condicionado
  criarArCondicionado: async (data) => {
    const response = await api.post('/operacional/ar-condicionado', data);
    return response.data;
  },

  listarArCondicionado: async (status = null) => {
    const url = status ? `/operacional/ar-condicionado?status=${status}` : '/operacional/ar-condicionado';
    const response = await api.get(url);
    return response.data;
  },

  // Elétrica
  criarEletrica: async (data) => {
    const response = await api.post('/operacional/eletrica', data);
    return response.data;
  },

  listarEletrica: async (tipo = null, status = null) => {
    let url = '/operacional/eletrica';
    const params = [];
    if (tipo) params.push(`tipo=${tipo}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Checklists
  criarChecklist: async (data) => {
    const response = await api.post('/operacional/checklists', data);
    return response.data;
  },

  listarChecklists: async (tipo = null, status = null) => {
    let url = '/operacional/checklists';
    const params = [];
    if (tipo) params.push(`tipo=${tipo}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

export const serralheriaService = {
  // Movimentações (Entradas/Saídas)
  criarMovimentacao: async (data) => {
    const response = await api.post('/serralheria/movimentacoes', data);
    return response.data;
  },

  listarMovimentacoes: async (tipo = null) => {
    const url = tipo ? `/serralheria/movimentacoes?tipo=${tipo}` : '/serralheria/movimentacoes';
    const response = await api.get(url);
    return response.data;
  },

  // Estoque
  criarItemEstoque: async (data) => {
    const response = await api.post('/serralheria/estoque', data);
    return response.data;
  },

  listarEstoque: async (categoria = null) => {
    const url = categoria ? `/serralheria/estoque?categoria=${categoria}` : '/serralheria/estoque';
    const response = await api.get(url);
    return response.data;
  },

  alertasEstoque: async () => {
    const response = await api.get('/serralheria/estoque/alertas');
    return response.data;
  },

  // Equipamentos
  criarEquipamento: async (data) => {
    const response = await api.post('/serralheria/equipamentos', data);
    return response.data;
  },

  listarEquipamentos: async (status = null, tipo = null) => {
    let url = '/serralheria/equipamentos';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (tipo) params.push(`tipo=${tipo}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },
};