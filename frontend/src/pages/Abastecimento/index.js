import React, { useState, useEffect } from 'react';
import { Plus, Search, Activity } from 'lucide-react';
import { veiculosService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Abastecimento = () => {
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [filteredAbastecimentos, setFilteredAbastecimentos] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [condutores, setCondutores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    veiculo_id: '',
    condutor_id: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    litros: '',
    km_veiculo: '',
    valor_total: '',
    posto: '',
    observacoes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = abastecimentos.filter((a) =>
      a.numero_abastecimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.posto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAbastecimentos(filtered);
  }, [searchTerm, abastecimentos]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [abastData, veicData, condData] = await Promise.all([
        veiculosService.listarAbastecimentos(),
        veiculosService.getAll(),
        veiculosService.listarCondutores(),
      ]);
      setAbastecimentos(abastData);
      setFilteredAbastecimentos(abastData);
      setVeiculos(veicData);
      setCondutores(condData);
    } catch (error) {
      showToast('error', 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = () => {
    setFormData({
      veiculo_id: '',
      condutor_id: '',
      data_abastecimento: new Date().toISOString().split('T')[0],
      litros: '',
      km_veiculo: '',
      valor_total: '',
      posto: '',
      observacoes: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        litros: parseFloat(formData.litros),
        km_veiculo: parseInt(formData.km_veiculo),
        valor_total: parseFloat(formData.valor_total),
      };

      await veiculosService.criarAbastecimento(dataToSend);
      showToast('success', 'Abastecimento registrado com sucesso!');
      handleCloseModal();
      loadData();
    } catch (error) {
      showToast('error', 'Erro ao registrar abastecimento');
    } finally {
      setIsLoading(false);
    }
  };

  const getVeiculoNome = (veiculo_id) => {
    const veiculo = veiculos.find((v) => v.id === veiculo_id);
    return veiculo ? `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}` : veiculo_id;
  };

  const getCondutorNome = (condutor_id) => {
    const condutor = condutores.find((c) => c.id === condutor_id);
    return condutor ? condutor.nome : condutor_id;
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="abastecimento-title">Abastecimento</h1>
          <p className="text-gray-400 mt-1">Controle de abastecimento de veículos</p>
        </div>
        <Button onClick={handleOpenModal} data-testid="add-abastecimento-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Abastecimento
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por número ou posto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Condutor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Litros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Posto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredAbastecimentos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Nenhum abastecimento encontrado</td>
                </tr>
              ) : (
                filteredAbastecimentos.map((abast) => (
                  <tr key={abast.id} className="hover:bg-[#1F2937] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-mono text-blue-400">{abast.numero_abastecimento}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(abast.data_abastecimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getVeiculoNome(abast.veiculo_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getCondutorNome(abast.condutor_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{abast.litros}L</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{abast.km_veiculo?.toLocaleString()} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">R$ {abast.valor_total?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{abast.posto || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Novo Abastecimento" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Veículo <span className="text-red-400">*</span></label>
              <select
                name="veiculo_id"
                value={formData.veiculo_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o veículo</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Condutor <span className="text-red-400">*</span></label>
              <select
                name="condutor_id"
                value={formData.condutor_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o condutor</option>
                {condutores.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Data" name="data_abastecimento" type="date" value={formData.data_abastecimento} onChange={handleInputChange} required />
            <Input label="KM do Veículo" name="km_veiculo" type="number" value={formData.km_veiculo} onChange={handleInputChange} required min="0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Litros" name="litros" type="number" step="0.01" value={formData.litros} onChange={handleInputChange} required min="0" />
            <Input label="Valor Total (R$)" name="valor_total" type="number" step="0.01" value={formData.valor_total} onChange={handleInputChange} required min="0" />
            <Input label="Posto" name="posto" value={formData.posto} onChange={handleInputChange} placeholder="Nome do posto" />
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
            <Button type="submit" isLoading={isLoading}>Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Abastecimento;
