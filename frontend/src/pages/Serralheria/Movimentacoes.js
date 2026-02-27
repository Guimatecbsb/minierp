import React, { useState, useEffect } from 'react';
import { serralheriaService } from '@/services';
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, AlertCircle, Calendar } from 'lucide-react';

const MovimentacoesSerralheria = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    item: '',
    categoria: 'materia_prima',
    quantidade: 0,
    unidade: 'm',
    origem_destino: '',
    responsavel: '',
    data_movimentacao: new Date().toISOString().split('T')[0],
    valor_unitario: 0,
    observacoes: ''
  });

  useEffect(() => {
    carregarMovimentacoes();
  }, [filtroTipo]);

  const carregarMovimentacoes = async () => {
    try {
      const data = await serralheriaService.listarMovimentacoes(filtroTipo || null);
      setMovimentacoes(data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await serralheriaService.criarMovimentacao(formData);
      setShowModal(false);
      resetForm();
      carregarMovimentacoes();
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'entrada',
      item: '',
      categoria: 'materia_prima',
      quantidade: 0,
      unidade: 'm',
      origem_destino: '',
      responsavel: '',
      data_movimentacao: new Date().toISOString().split('T')[0],
      valor_unitario: 0,
      observacoes: ''
    });
  };

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.origem_destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Movimentações - Serralheria</h1>
          <p className="text-base text-gray-400">Controle de entradas e saídas de materiais</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Movimentação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por item ou origem/destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroTipo('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === '' ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroTipo('entrada')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === 'entrada' ? 'bg-green-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFiltroTipo('saida')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === 'saida' ? 'bg-red-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
            }`}
          >
            Saídas
          </button>
        </div>
      </div>

      {/* Lista de Movimentações */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filteredMovimentacoes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhuma movimentação encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Origem/Destino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {filteredMovimentacoes.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#0D1117] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mov.tipo === 'entrada' ? (
                        <div className="flex items-center text-green-400">
                          <ArrowUpCircle className="w-5 h-5 mr-2" />
                          Entrada
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <ArrowDownCircle className="w-5 h-5 mr-2" />
                          Saída
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{mov.numero_movimentacao}</td>
                    <td className="px-6 py-4 text-gray-300">{mov.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {mov.quantidade} {mov.unidade}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{mov.origem_destino}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400">
                      R$ {mov.valor_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Movimentação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Nova Movimentação</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="materia_prima">Matéria-Prima</option>
                    <option value="equipamento">Equipamento</option>
                    <option value="ferramenta">Ferramenta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Item *</label>
                <input
                  type="text"
                  required
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Tubo de Aço 2 polegadas"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Unidade *</label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="un">unidade</option>
                    <option value="l">litro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {formData.tipo === 'entrada' ? 'Origem *' : 'Destino *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.origem_destino}
                  onChange={(e) => setFormData({ ...formData, origem_destino: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={formData.tipo === 'entrada' ? 'Ex: Fornecedor ABC' : 'Ex: Obra Centro'}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_movimentacao}
                    onChange={(e) => setFormData({ ...formData, data_movimentacao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valor Unitário</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor_unitario}
                    onChange={(e) => setFormData({ ...formData, valor_unitario: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Registrar Movimentação
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

export default MovimentacoesSerralheria;