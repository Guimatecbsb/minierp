import React, { useState, useEffect } from 'react';
import { serralheriaService } from '@/services';
import { Plus, Search, Wrench, AlertCircle, Calendar } from 'lucide-react';

const EquipamentosSerralheria = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'solda',
    marca: '',
    modelo: '',
    numero_serie: '',
    status: 'disponivel',
    data_aquisicao: '',
    data_ultima_manutencao: '',
    responsavel_atual: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarEquipamentos();
  }, [filtroStatus, filtroTipo]);

  const carregarEquipamentos = async () => {
    try {
      const data = await serralheriaService.listarEquipamentos(filtroStatus || null, filtroTipo || null);
      setEquipamentos(data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await serralheriaService.criarEquipamento(formData);
      setShowModal(false);
      resetForm();
      carregarEquipamentos();
    } catch (error) {
      console.error('Erro ao criar equipamento:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'solda',
      marca: '',
      modelo: '',
      numero_serie: '',
      status: 'disponivel',
      data_aquisicao: '',
      data_ultima_manutencao: '',
      responsavel_atual: '',
      observacoes: ''
    });
  };

  const filteredEquipamentos = equipamentos.filter(eq =>
    eq.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'disponivel': 'bg-green-500/20 text-green-400',
      'em_uso': 'bg-blue-500/20 text-blue-400',
      'manutencao': 'bg-yellow-500/20 text-yellow-400',
      'indisponivel': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Equipamentos - Serralheria</h1>
          <p className="text-base text-gray-400">Gestão de equipamentos e ferramentas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Equipamento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, marca ou código..."
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
            <option value="solda">Solda</option>
            <option value="corte">Corte</option>
            <option value="dobragem">Dobragem</option>
            <option value="furadeira">Furadeira</option>
          </select>
          {['', 'disponivel', 'em_uso', 'manutencao', 'indisponivel'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === status ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              {status === '' ? 'Todos Status' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Equipamentos */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filteredEquipamentos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhum equipamento encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca/Modelo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Última Manutenção</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {filteredEquipamentos.map((eq) => (
                  <tr key={eq.id} className="hover:bg-[#0D1117] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{eq.codigo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Wrench className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-white">{eq.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{eq.tipo}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {eq.marca} {eq.modelo && `- ${eq.modelo}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {eq.data_ultima_manutencao ? (
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(eq.data_ultima_manutencao).toLocaleDateString('pt-BR')}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                        {eq.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Equipamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Novo Equipamento</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                    <option value="solda">Solda</option>
                    <option value="corte">Corte</option>
                    <option value="dobragem">Dobragem</option>
                    <option value="furadeira">Furadeira</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Número de Série</label>
                  <input
                    type="text"
                    value={formData.numero_serie}
                    onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="em_uso">Em Uso</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="indisponivel">Indisponível</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data de Aquisição</label>
                  <input
                    type="date"
                    value={formData.data_aquisicao}
                    onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Última Manutenção</label>
                  <input
                    type="date"
                    value={formData.data_ultima_manutencao}
                    onChange={(e) => setFormData({ ...formData, data_ultima_manutencao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Responsável Atual</label>
                <input
                  type="text"
                  value={formData.responsavel_atual}
                  onChange={(e) => setFormData({ ...formData, responsavel_atual: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Cadastrar Equipamento
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

export default EquipamentosSerralheria;