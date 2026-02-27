import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { equipamentosService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Equipamentos = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [filteredEquipamentos, setFilteredEquipamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    tipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    quantidade: 1,
    estado: 'disponível',
    localizacao: '',
    observacoes: '',
  });

  const tiposEquipamento = ['Som', 'Camarim', 'Ar Condicionado', 'Elétrica', 'Serralheria', 'Iluminação', 'Estrutura', 'Outros'];
  const estadosEquipamento = ['disponível', 'indisponível', 'manutenção', 'emprestado'];

  useEffect(() => {
    loadEquipamentos();
  }, []);

  useEffect(() => {
    let filtered = equipamentos;
    
    if (searchTerm) {
      filtered = filtered.filter((eq) =>
        eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.marca && eq.marca.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterTipo) {
      filtered = filtered.filter((eq) => eq.tipo === filterTipo);
    }

    setFilteredEquipamentos(filtered);
  }, [searchTerm, filterTipo, equipamentos]);

  const loadEquipamentos = async () => {
    try {
      setIsLoading(true);
      const data = await equipamentosService.getAll();
      setEquipamentos(data);
      setFilteredEquipamentos(data);
    } catch (error) {
      showToast('error', 'Erro ao carregar equipamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (equipamento = null) => {
    if (equipamento) {
      setEditingEquipamento(equipamento);
      setFormData({
        nome: equipamento.nome,
        codigo: equipamento.codigo,
        tipo: equipamento.tipo,
        marca: equipamento.marca || '',
        modelo: equipamento.modelo || '',
        numero_serie: equipamento.numero_serie || '',
        quantidade: equipamento.quantidade,
        estado: equipamento.estado,
        localizacao: equipamento.localizacao || '',
        observacoes: equipamento.observacoes || '',
      });
    } else {
      setEditingEquipamento(null);
      setFormData({
        nome: '',
        codigo: '',
        tipo: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        quantidade: 1,
        estado: 'disponível',
        localizacao: '',
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEquipamento(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        quantidade: parseInt(formData.quantidade),
      };

      if (editingEquipamento) {
        await equipamentosService.update(editingEquipamento.id, dataToSend);
        showToast('success', 'Equipamento atualizado com sucesso!');
      } else {
        await equipamentosService.create(dataToSend);
        showToast('success', 'Equipamento criado com sucesso!');
      }
      handleCloseModal();
      loadEquipamentos();
    } catch (error) {
      showToast('error', 'Erro ao salvar equipamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este equipamento?')) return;

    try {
      await equipamentosService.delete(id);
      showToast('success', 'Equipamento excluído com sucesso!');
      loadEquipamentos();
    } catch (error) {
      showToast('error', 'Erro ao excluir equipamento');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'disponível': 'bg-green-500/20 text-green-400',
      'indisponível': 'bg-red-500/20 text-red-400',
      'manutenção': 'bg-yellow-500/20 text-yellow-400',
      'emprestado': 'bg-blue-500/20 text-blue-400',
    };
    return badges[estado] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="equipamentos-title">Equipamentos</h1>
          <p className="text-gray-400 mt-1">Gerenciamento de equipamentos</p>
        </div>
        <Button onClick={() => handleOpenModal()} data-testid="add-equipamento-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, código ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            {tiposEquipamento.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca/Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Qtd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredEquipamentos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Nenhum equipamento encontrado</td>
                </tr>
              ) : (
                filteredEquipamentos.map((equipamento) => (
                  <tr key={equipamento.id} className="hover:bg-[#1F2937] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-blue-400">{equipamento.codigo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{equipamento.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{equipamento.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {equipamento.marca && equipamento.modelo ? `${equipamento.marca} ${equipamento.modelo}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{equipamento.quantidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(equipamento.estado)}`}>
                        {equipamento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(equipamento)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(equipamento.id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Nome do equipamento" />
            <Input label="Código" name="codigo" value={formData.codigo} onChange={handleInputChange} required placeholder="EQ-001" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo <span className="text-red-400">*</span></label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o tipo</option>
                {tiposEquipamento.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadosEquipamento.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Marca" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Marca" />
            <Input label="Modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Modelo" />
            <Input label="Nº Série" name="numero_serie" value={formData.numero_serie} onChange={handleInputChange} placeholder="Número de série" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Quantidade" name="quantidade" type="number" value={formData.quantidade} onChange={handleInputChange} required min="1" />
            <Input label="Localização" name="localizacao" value={formData.localizacao} onChange={handleInputChange} placeholder="Localização física" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" isLoading={isLoading}>{editingEquipamento ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Equipamentos;
