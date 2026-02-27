import React, { useState, useEffect } from 'react';
import { operacionalService } from '@/services';
import { Plus, Search, CheckSquare, Calendar, AlertCircle, User } from 'lucide-react';

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [formData, setFormData] = useState({
    evento_id: '',
    tipo: 'pre_evento',
    titulo: '',
    itens: [{ descricao: '', concluido: false, responsavel: '' }],
    status: 'pendente',
    responsavel: '',
    data_prevista: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarChecklists();
  }, [filtroTipo, filtroStatus]);

  const carregarChecklists = async () => {
    try {
      const data = await operacionalService.listarChecklists(filtroTipo || null, filtroStatus || null);
      setChecklists(data);
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await operacionalService.criarChecklist(formData);
      setShowModal(false);
      resetForm();
      carregarChecklists();
    } catch (error) {
      console.error('Erro ao criar checklist:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      evento_id: '',
      tipo: 'pre_evento',
      titulo: '',
      itens: [{ descricao: '', concluido: false, responsavel: '' }],
      status: 'pendente',
      responsavel: '',
      data_prevista: '',
      observacoes: ''
    });
  };

  const adicionarItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { descricao: '', concluido: false, responsavel: '' }]
    });
  };

  const removerItem = (index) => {
    const novosItens = formData.itens.filter((_, i) => i !== index);
    setFormData({ ...formData, itens: novosItens });
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...formData.itens];
    novosItens[index][campo] = valor;
    setFormData({ ...formData, itens: novosItens });
  };

  const filteredChecklists = checklists.filter(check =>
    check.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-500/20 text-yellow-400',
      'em_andamento': 'bg-blue-500/20 text-blue-400',
      'concluido': 'bg-green-500/20 text-green-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const calcularProgresso = (itens) => {
    if (!itens || itens.length === 0) return 0;
    const concluidos = itens.filter(item => item.concluido).length;
    return Math.round((concluidos / itens.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Checklists Operacionais</h1>
          <p className="text-base text-gray-400">Gestão de checklists de eventos e operações</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Checklist
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos os Tipos</option>
            <option value="pre_evento">Pré-Evento</option>
            <option value="pos_evento">Pós-Evento</option>
            <option value="seguranca">Segurança</option>
            <option value="equipamentos">Equipamentos</option>
          </select>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>

      {/* Lista de Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-8">Carregando...</div>
        ) : filteredChecklists.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhum checklist encontrado
          </div>
        ) : (
          filteredChecklists.map((check) => {
            const progresso = calcularProgresso(check.itens);
            return (
              <div key={check.id} className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <CheckSquare className="w-6 h-6 text-blue-400" />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                    {check.status.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{check.titulo}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    {check.responsavel}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(check.data_prevista).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{progresso}%</span>
                  </div>
                  <div className="w-full bg-[#0D1117] rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  {check.itens.filter(i => i.concluido).length} / {check.itens.length} itens completos
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Novo Checklist */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Novo Checklist</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID do Evento *</label>
                  <input
                    type="text"
                    required
                    value={formData.evento_id}
                    onChange={(e) => setFormData({ ...formData, evento_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pre_evento">Pré-Evento</option>
                    <option value="pos_evento">Pós-Evento</option>
                    <option value="seguranca">Segurança</option>
                    <option value="equipamentos">Equipamentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Responsável *</label>
                  <input
                    type="text"
                    required
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data Prevista *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_prevista}
                    onChange={(e) => setFormData({ ...formData, data_prevista: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Itens do Checklist</label>
                {formData.itens.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Descrição do item"
                      value={item.descricao}
                      onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Responsável"
                      value={item.responsavel}
                      onChange={(e) => atualizarItem(index, 'responsavel', e.target.value)}
                      className="w-40 px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    {formData.itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={adicionarItem}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Adicionar Item
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Criar Checklist
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;