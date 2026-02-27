import React, { useState, useEffect } from 'react';
import { operacionalService } from '@/services';
import { Plus, Search, Wrench, Clock, AlertCircle, User } from 'lucide-react';

const Atividades = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'montagem',
    descricao: '',
    duracao_estimada: 60,
    equipamentos_necessarios: [],
    responsavel_padrao: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarAtividades();
  }, [filtroTipo]);

  const carregarAtividades = async () => {
    try {
      const data = await operacionalService.listarAtividades(filtroTipo || null);
      setAtividades(data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await operacionalService.criarAtividade(formData);
      setShowModal(false);
      resetForm();
      carregarAtividades();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'montagem',
      descricao: '',
      duracao_estimada: 60,
      equipamentos_necessarios: [],
      responsavel_padrao: '',
      observacoes: ''
    });
  };

  const filteredAtividades = atividades.filter(ativ =>
    ativ.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ativ.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo) => {
    const colors = {
      'montagem': 'bg-blue-500/20 text-blue-400',
      'desmontagem': 'bg-red-500/20 text-red-400',
      'camarin': 'bg-purple-500/20 text-purple-400',
      'ar_condicionado': 'bg-cyan-500/20 text-cyan-400',
      'eletrica': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[tipo] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">Cadastro de Atividades</h1>
          <p className="text-base text-gray-400">Gerenciamento de atividades operacionais</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Atividade
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'montagem', 'desmontagem', 'camarin', 'ar_condicionado', 'eletrica'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === tipo ? 'bg-blue-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              {tipo === '' ? 'Todas' : tipo.replace('_', ' ').charAt(0).toUpperCase() + tipo.replace('_', ' ').slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-8">Carregando...</div>
        ) : filteredAtividades.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Nenhuma atividade encontrada
          </div>
        ) : (
          filteredAtividades.map((ativ) => (
            <div key={ativ.id} className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <Wrench className="w-6 h-6 text-blue-400" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(ativ.tipo)}`}>
                  {ativ.tipo.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{ativ.nome}</h3>
              
              {ativ.descricao && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ativ.descricao}</p>
              )}
              
              <div className="space-y-2">
                {ativ.duracao_estimada && (
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {ativ.duracao_estimada} minutos
                  </div>
                )}
                {ativ.responsavel_padrao && (
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    {ativ.responsavel_padrao}
                  </div>
                )}
                {ativ.equipamentos_necessarios && ativ.equipamentos_necessarios.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Equipamentos: {ativ.equipamentos_necessarios.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Atividade */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#30363D]">
              <h2 className="text-2xl font-bold text-white">Nova Atividade</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Montagem de Estrutura Principal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="montagem">Montagem</option>
                    <option value="desmontagem">Desmontagem</option>
                    <option value="camarin">Camarin</option>
                    <option value="ar_condicionado">Ar Condicionado</option>
                    <option value="eletrica">Elétrica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duração Estimada (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duracao_estimada}
                    onChange={(e) => setFormData({ ...formData, duracao_estimada: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Responsável Padrão</label>
                <input
                  type="text"
                  value={formData.responsavel_padrao}
                  onChange={(e) => setFormData({ ...formData, responsavel_padrao: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Equipamentos Necessários (separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Guindaste, Parafusadeira, Escada"
                  onChange={(e) => {
                    const equipamentos = e.target.value.split(',').map(eq => eq.trim()).filter(eq => eq);
                    setFormData({ ...formData, equipamentos_necessarios: equipamentos });
                  }}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Criar Atividade
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

export default Atividades;