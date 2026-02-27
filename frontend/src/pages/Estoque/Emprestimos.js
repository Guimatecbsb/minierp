import React, { useState, useEffect } from 'react';
import { estoqueService } from '@/services';
import { Plus, Search, Package, Calendar, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Emprestimos = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [formData, setFormData] = useState({
    tipo: 'tomado_emprestado',
    item_id: '',
    quantidade: 1,
    responsavel: '',
    destino: '',
    data_emprestimo: new Date().toISOString().split('T')[0],
    data_prevista_devolucao: '',
    status: 'ativo'
  });

  useEffect(() => {
    carregarEmprestimos();
  }, [filtroTipo, filtroStatus]);

  const carregarEmprestimos = async () => {
    try {
      const data = await estoqueService.listarEmprestimos(filtroTipo || null, filtroStatus || null);
      setEmprestimos(data);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estoqueService.criarEmprestimo(formData);
      setShowModal(false);
      resetForm();
      carregarEmprestimos();
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'tomado_emprestado',
      item_id: '',
      quantidade: 1,
      responsavel: '',
      destino: '',
      data_emprestimo: new Date().toISOString().split('T')[0],
      data_prevista_devolucao: '',
      status: 'ativo'
    });
  };

  const filteredEmprestimos = emprestimos.filter(emp =>
    emp.responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'ativo': 'bg-yellow-500/20 text-yellow-400',
      'devolvido': 'bg-green-500/20 text-green-400',
      'atrasado': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getTipoIcon = (tipo) => {
    return tipo === 'tomado_emprestado' ? (
      <ArrowLeft className="w-4 h-4 text-blue-400" />
    ) : (
      <ArrowRight className="w-4 h-4 text-green-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Empréstimos</h1>
          <p className="text-base text-gray-400">Controle de itens tomados emprestado e emprestados a terceiros</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Empréstimo
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por responsável ou destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroTipo('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === '' ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroTipo('tomado_emprestado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'tomado_emprestado' ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              Tomado Emprestado
            </button>
            <button
              onClick={() => setFiltroTipo('emprestado_terceiro')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'emprestado_terceiro' ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              Emprestado a Terceiro
            </button>
          </div>
          <div className="w-px bg-[#30363D]"></div>
          <div className="flex gap-2">
            {['', 'ativo', 'devolvido', 'atrasado'].map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === status ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
                }`}
              >
                {status === '' ? 'Todos Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Empréstimos */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filteredEmprestimos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhum empréstimo encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data Empréstimo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Previsão Devolução</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {filteredEmprestimos.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#0D1117] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(emp.tipo)}
                        <span className="text-gray-300 text-sm">
                          {emp.tipo === 'tomado_emprestado' ? 'Tomado' : 'Emprestado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{emp.responsavel}</td>
                    <td className="px-6 py-4 text-gray-300">{emp.destino}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{emp.quantidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(emp.data_emprestimo).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(emp.data_prevista_devolucao).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Empréstimo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Novo Empréstimo</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="tomado_emprestado">Tomado Emprestado</option>
                  <option value="emprestado_terceiro">Emprestado a Terceiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID do Item</label>
                <input
                  type="text"
                  required
                  value={formData.item_id}
                  onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Responsável</label>
                  <input
                    type="text"
                    required
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destino</label>
                <input
                  type="text"
                  required
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data do Empréstimo</label>
                  <input
                    type="date"
                    required
                    value={formData.data_emprestimo}
                    onChange={(e) => setFormData({ ...formData, data_emprestimo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Previsão de Devolução</label>
                  <input
                    type="date"
                    required
                    value={formData.data_prevista_devolucao}
                    onChange={(e) => setFormData({ ...formData, data_prevista_devolucao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Criar Empréstimo
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

export default Emprestimos;