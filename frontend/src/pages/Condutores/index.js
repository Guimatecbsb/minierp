import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, AlertCircle } from 'lucide-react';
import { veiculosService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Condutores = () => {
  const [condutores, setCondutores] = useState([]);
  const [filteredCondutores, setFilteredCondutores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnh: '',
    categoria_cnh: 'B',
    validade_cnh: '',
    telefone: '',
    status: 'ativo',
  });

  useEffect(() => {
    loadCondutores();
  }, []);

  useEffect(() => {
    const filtered = condutores.filter((c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm) ||
      c.cnh.includes(searchTerm)
    );
    setFilteredCondutores(filtered);
  }, [searchTerm, condutores]);

  const loadCondutores = async () => {
    try {
      setIsLoading(true);
      const data = await veiculosService.listarCondutores();
      setCondutores(data);
      setFilteredCondutores(data);
    } catch (error) {
      showToast('error', 'Erro ao carregar condutores');
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
      nome: '',
      cpf: '',
      cnh: '',
      categoria_cnh: 'B',
      validade_cnh: '',
      telefone: '',
      status: 'ativo',
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
      await veiculosService.criarCondutor(formData);
      showToast('success', 'Condutor cadastrado com sucesso!');
      handleCloseModal();
      loadCondutores();
    } catch (error) {
      showToast('error', 'Erro ao cadastrar condutor');
    } finally {
      setIsLoading(false);
    }
  };

  const isValido = (validade) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    return dataValidade > hoje;
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="condutores-title">Condutores</h1>
          <p className="text-gray-400 mt-1">Cadastro de motoristas e condutores</p>
        </div>
        <Button onClick={handleOpenModal} data-testid="add-condutor-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Condutor
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou CNH..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CNH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Validade CNH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredCondutores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Nenhum condutor encontrado</td>
                </tr>
              ) : (
                filteredCondutores.map((condutor) => {
                  const cnhValida = isValido(condutor.validade_cnh);
                  return (
                    <tr key={condutor.id} className="hover:bg-[#1F2937] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-blue-400">{condutor.codigo_cadastro}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">{condutor.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{condutor.cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{condutor.cnh}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          {condutor.categoria_cnh}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <span>{new Date(condutor.validade_cnh).toLocaleDateString('pt-BR')}</span>
                          {!cnhValida && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          condutor.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {condutor.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Novo Condutor" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome Completo" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Nome do condutor" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleInputChange} required placeholder="000.000.000-00" />
            <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(00) 00000-0000" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="CNH" name="cnh" value={formData.cnh} onChange={handleInputChange} required placeholder="Número da CNH" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Categoria CNH <span className="text-red-400">*</span></label>
              <select
                name="categoria_cnh"
                value={formData.categoria_cnh}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="AB">AB</option>
                <option value="AC">AC</option>
                <option value="AD">AD</option>
                <option value="AE">AE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Validade CNH" name="validade_cnh" type="date" value={formData.validade_cnh} onChange={handleInputChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" isLoading={isLoading}>Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Condutores;
