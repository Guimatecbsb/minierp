import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Truck } from 'lucide-react';
import { veiculosService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    placa: '',
    tipo: 'pesado',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    status: 'ativo',
    km_atual: 0,
    observacoes: '',
  });

  useEffect(() => {
    loadVeiculos();
  }, []);

  useEffect(() => {
    let filtered = veiculos;
    
    if (searchTerm) {
      filtered = filtered.filter((v) =>
        v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTipo) {
      filtered = filtered.filter((v) => v.tipo === filterTipo);
    }

    setFilteredVeiculos(filtered);
  }, [searchTerm, filterTipo, veiculos]);

  const loadVeiculos = async () => {
    try {
      setIsLoading(true);
      const data = await veiculosService.getAll();
      setVeiculos(data);
      setFilteredVeiculos(data);
    } catch (error) {
      showToast('error', 'Erro ao carregar veículos');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (veiculo = null) => {
    if (veiculo) {
      setEditingVeiculo(veiculo);
      setFormData({
        placa: veiculo.placa,
        tipo: veiculo.tipo,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        status: veiculo.status,
        km_atual: veiculo.km_atual || 0,
        observacoes: veiculo.observacoes || '',
      });
    } else {
      setEditingVeiculo(null);
      setFormData({
        placa: '',
        tipo: 'pesado',
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        status: 'ativo',
        km_atual: 0,
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVeiculo(null);
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
        ano: parseInt(formData.ano),
        km_atual: parseInt(formData.km_atual),
      };

      if (editingVeiculo) {
        // Backend não tem update para veículo ainda, vamos apenas criar
        showToast('info', 'Edição de veículo será implementada');
      } else {
        await veiculosService.create(dataToSend);
        showToast('success', 'Veículo criado com sucesso!');
      }
      handleCloseModal();
      loadVeiculos();
    } catch (error) {
      showToast('error', 'Erro ao salvar veículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;

    try {
      await veiculosService.delete(id);
      showToast('success', 'Veículo excluído com sucesso!');
      loadVeiculos();
    } catch (error) {
      showToast('error', 'Erro ao excluir veículo');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'ativo': 'bg-green-500/20 text-green-400',
      'manutenção': 'bg-yellow-500/20 text-yellow-400',
      'inativo': 'bg-red-500/20 text-red-400',
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="veiculos-title">Veículos</h1>
          <p className="text-gray-400 mt-1">Gerenciamento de veículos pesados e leves</p>
        </div>
        <Button onClick={() => handleOpenModal()} data-testid="add-veiculo-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por placa, marca ou modelo..."
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
            <option value="pesado">Pesado</option>
            <option value="leve">Leve</option>
          </select>
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca/Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">KM Atual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredVeiculos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Nenhum veículo encontrado</td>
                </tr>
              ) : (
                filteredVeiculos.map((veiculo) => (
                  <tr key={veiculo.id} className="hover:bg-[#1F2937] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-mono font-medium text-white">{veiculo.placa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        veiculo.tipo === 'pesado' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {veiculo.tipo === 'pesado' ? 'Pesado' : 'Leve'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{veiculo.marca} {veiculo.modelo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{veiculo.ano}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{veiculo.km_atual?.toLocaleString()} km</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(veiculo.status)}`}>
                        {veiculo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(veiculo)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(veiculo.id)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Placa" name="placa" value={formData.placa} onChange={handleInputChange} required placeholder="ABC-1D34" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo <span className="text-red-400">*</span></label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pesado">Pesado</option>
                <option value="leve">Leve</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Marca" name="marca" value={formData.marca} onChange={handleInputChange} required placeholder="Mercedes" />
            <Input label="Modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} required placeholder="Atego 1719" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Ano" name="ano" type="number" value={formData.ano} onChange={handleInputChange} required min="1950" max={new Date().getFullYear() + 1} />
            <Input label="KM Atual" name="km_atual" type="number" value={formData.km_atual} onChange={handleInputChange} min="0" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ativo">Ativo</option>
                <option value="manutenção">Manutenção</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
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
            <Button type="submit" isLoading={isLoading}>{editingVeiculo ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Veiculos;