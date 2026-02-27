import React, { useState, useEffect } from 'react';
import { estoqueService } from '@/services';
import { Plus, Search, Shield, Calendar, AlertCircle, AlertTriangle } from 'lucide-react';

const EPIs = () => {
  const [epis, setEpis] = useState([]);
  const [alertas, setAlertas] = useState({ total_alertas: 0, alertas: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    tamanho: '',
    ca: '',
    quantidade_estoque: 0,
    quantidade_minima: 0,
    validade: '',
    status: 'disponivel'
  });

  useEffect(() => {
    carregarEPIs();
    carregarAlertas();
  }, [filtroStatus]);

  const carregarEPIs = async () => {
    try {
      const data = await estoqueService.listarEPIs(filtroStatus || null);
      setEpis(data);
    } catch (error) {
      console.error('Erro ao carregar EPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarAlertas = async () => {
    try {
      const data = await estoqueService.alertasEPIs();
      setAlertas(data);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estoqueService.criarEPI(formData);
      setShowModal(false);
      resetForm();
      carregarEPIs();
      carregarAlertas();
    } catch (error) {
      console.error('Erro ao criar EPI:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: '',
      marca: '',
      tamanho: '',
      ca: '',
      quantidade_estoque: 0,
      quantidade_minima: 0,
      validade: '',
      status: 'disponivel'
    });
  };

  const filteredEPIs = epis.filter(epi =>
    epi.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.ca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'disponivel': 'bg-green-500/20 text-green-400',
      'em_uso': 'bg-blue-500/20 text-blue-400',
      'indisponivel': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getNivelEstoque = (epi) => {
    if (epi.quantidade_estoque === 0) {
      return { cor: 'text-red-400', texto: 'Crítico' };
    } else if (epi.quantidade_estoque <= epi.quantidade_minima) {
      return { cor: 'text-yellow-400', texto: 'Baixo' };
    }
    return { cor: 'text-green-400', texto: 'Normal' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">EPIs</h1>
          <p className="text-base text-gray-400">Equipamentos de Proteção Individual - Controle de estoque</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo EPI
        </button>
      </div>

      {/* Alertas */}
      {alertas.total_alertas > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                {alertas.total_alertas} Alerta(s) de Estoque
              </h3>
              <div className="space-y-2">
                {alertas.alertas.map((alerta, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    <span className="font-medium">{alerta.tipo}</span> ({alerta.marca}) - 
                    Estoque atual: <span className={alerta.nivel === 'critico' ? 'text-red-400 font-bold' : 'text-yellow-400'}>
                      {alerta.quantidade_atual}
                    </span> / Mínimo: {alerta.quantidade_minima}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por tipo, marca ou CA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'disponivel', 'em_uso', 'indisponivel'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              {status === '' ? 'Todos' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de EPIs */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filteredEPIs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhum EPI encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tamanho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Validade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {filteredEPIs.map((epi) => {
                  const nivelEstoque = getNivelEstoque(epi);
                  return (
                    <tr key={epi.id} className="hover:bg-[#0D1117] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-white font-medium">{epi.tipo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{epi.marca}</td>
                      <td className="px-6 py-4 text-gray-300">{epi.tamanho || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-300">{epi.ca || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${nivelEstoque.cor}`}>
                            {epi.quantidade_estoque}
                          </span>
                          <span className="text-gray-500">/</span>
                          <span className="text-gray-400 text-sm">
                            mín: {epi.quantidade_minima}
                          </span>
                          <span className={`text-xs ${nivelEstoque.cor}`}>
                            ({nivelEstoque.texto})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {epi.validade ? new Date(epi.validade).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(epi.status)}`}>
                          {epi.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo EPI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Novo EPI</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo *</label>
                  <input
                    type="text"
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Capacete, Luva, Botina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Marca *</label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tamanho</label>
                  <input
                    type="text"
                    value={formData.tamanho}
                    onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: M, G, 42"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CA (Certificado de Aprovação)</label>
                  <input
                    type="text"
                    value={formData.ca}
                    onChange={(e) => setFormData({ ...formData, ca: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantidade_estoque}
                    onChange={(e) => setFormData({ ...formData, quantidade_estoque: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade Mínima *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantidade_minima}
                    onChange={(e) => setFormData({ ...formData, quantidade_minima: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Validade</label>
                  <input
                    type="date"
                    value={formData.validade}
                    onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="em_uso">Em Uso</option>
                    <option value="indisponivel">Indisponível</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Cadastrar EPI
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

export default EPIs;