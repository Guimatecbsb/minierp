import React, { useState, useEffect } from 'react';
import { serralheriaService } from '@/services';
import { Plus, Search, Package, AlertTriangle, AlertCircle } from 'lucide-react';

const EstoqueSerralheria = () => {
  const [estoque, setEstoque] = useState([]);
  const [alertas, setAlertas] = useState({ total_alertas: 0, alertas: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [formData, setFormData] = useState({
    item: '',
    categoria: 'materia_prima',
    unidade: 'm',
    quantidade_atual: 0,
    quantidade_minima: 0,
    localizacao: '',
    valor_unitario: 0,
    observacoes: ''
  });

  useEffect(() => {
    carregarEstoque();
    carregarAlertas();
  }, [filtroCategoria]);

  const carregarEstoque = async () => {
    try {
      const data = await serralheriaService.listarEstoque(filtroCategoria || null);
      setEstoque(data);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarAlertas = async () => {
    try {
      const data = await serralheriaService.alertasEstoque();
      setAlertas(data);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await serralheriaService.criarItemEstoque(formData);
      setShowModal(false);
      resetForm();
      carregarEstoque();
      carregarAlertas();
    } catch (error) {
      console.error('Erro ao criar item:', error);
      alert(error.response?.data?.detail || 'Erro ao criar item');
    }
  };

  const resetForm = () => {
    setFormData({
      item: '',
      categoria: 'materia_prima',
      unidade: 'm',
      quantidade_atual: 0,
      quantidade_minima: 0,
      localizacao: '',
      valor_unitario: 0,
      observacoes: ''
    });
  };

  const filteredEstoque = estoque.filter(item =>
    item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNivelEstoque = (item) => {
    if (item.quantidade_atual === 0) {
      return { cor: 'text-red-400', texto: 'Crítico', badge: 'bg-red-500/20 text-red-400' };
    } else if (item.quantidade_atual <= item.quantidade_minima) {
      return { cor: 'text-yellow-400', texto: 'Baixo', badge: 'bg-yellow-500/20 text-yellow-400' };
    }
    return { cor: 'text-green-400', texto: 'Normal', badge: 'bg-green-500/20 text-green-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Estoque - Serralheria</h1>
          <p className="text-base text-gray-400">Controle de estoque de materiais e equipamentos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Item
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
                    <span className="font-medium">{alerta.item}</span> ({alerta.categoria}) - 
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
            placeholder="Buscar por item ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['', 'materia_prima', 'equipamento', 'ferramenta'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroCategoria === cat ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              {cat === '' ? 'Todas' : cat === 'materia_prima' ? 'Matéria-Prima' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Estoque */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filteredEstoque.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhum item encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D1117] border-b border-[#30363D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor Unitário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {filteredEstoque.map((item) => {
                  const nivel = getNivelEstoque(item);
                  return (
                    <tr key={item.id} className="hover:bg-[#0D1117] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-white font-medium">{item.item}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.categoria.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${nivel.cor}`}>
                            {item.quantidade_atual} {item.unidade}
                          </span>
                          <span className="text-gray-500">/</span>
                          <span className="text-gray-400 text-sm">
                            mín: {item.quantidade_minima}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.localizacao}</td>
                      <td className="px-6 py-4 text-green-400">
                        {item.valor_unitario ? `R$ ${item.valor_unitario.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${nivel.badge}`}>
                          {nivel.texto}
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

      {/* Modal Novo Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Novo Item de Estoque</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade Atual *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.quantidade_atual}
                    onChange={(e) => setFormData({ ...formData, quantidade_atual: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade Mínima *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.quantidade_minima}
                    onChange={(e) => setFormData({ ...formData, quantidade_minima: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Localização *</label>
                  <input
                    type="text"
                    required
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Galpão A - Setor 1"
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
                  Cadastrar Item
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

export default EstoqueSerralheria;