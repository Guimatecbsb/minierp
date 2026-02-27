import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building } from 'lucide-react';
import { fornecedoresService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    contato_responsavel: '',
    tipo_servico: '',
    observacoes: '',
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  useEffect(() => {
    const filtered = fornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.includes(searchTerm) ||
      (fornecedor.email && fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredFornecedores(filtered);
  }, [searchTerm, fornecedores]);

  const loadFornecedores = async () => {
    try {
      setIsLoading(true);
      const data = await fornecedoresService.getAll();
      setFornecedores(data);
      setFilteredFornecedores(data);
    } catch (error) {
      showToast('error', 'Erro ao carregar fornecedores');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (fornecedor = null) => {
    if (fornecedor) {
      setEditingFornecedor(fornecedor);
      setFormData({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        email: fornecedor.email || '',
        telefone: fornecedor.telefone || '',
        endereco: fornecedor.endereco || '',
        contato_responsavel: fornecedor.contato_responsavel || '',
        tipo_servico: fornecedor.tipo_servico || '',
        observacoes: fornecedor.observacoes || '',
      });
    } else {
      setEditingFornecedor(null);
      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        contato_responsavel: '',
        tipo_servico: '',
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFornecedor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingFornecedor) {
        await fornecedoresService.update(editingFornecedor.id, formData);
        showToast('success', 'Fornecedor atualizado com sucesso!');
      } else {
        await fornecedoresService.create(formData);
        showToast('success', 'Fornecedor criado com sucesso!');
      }
      handleCloseModal();
      loadFornecedores();
    } catch (error) {
      showToast('error', 'Erro ao salvar fornecedor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) return;

    try {
      await fornecedoresService.delete(id);
      showToast('success', 'Fornecedor excluído com sucesso!');
      loadFornecedores();
    } catch (error) {
      showToast('error', 'Erro ao excluir fornecedor');
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="fornecedores-title">Fornecedores</h1>
          <p className="text-gray-400 mt-1">Gerenciamento de fornecedores</p>
        </div>
        <Button onClick={() => handleOpenModal()} data-testid="add-fornecedor-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CNPJ ou email..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredFornecedores.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Nenhum fornecedor encontrado</td>
                </tr>
              ) : (
                filteredFornecedores.map((fornecedor) => (
                  <tr key={fornecedor.id} className="hover:bg-[#1F2937] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-blue-400">{fornecedor.codigo_cadastro}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{fornecedor.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fornecedor.cnpj}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fornecedor.tipo_servico || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{fornecedor.telefone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(fornecedor)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fornecedor.id)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Nome do fornecedor" />
            <Input label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required placeholder="00.000.000/0000-00" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@exemplo.com" />
            <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(00) 0000-0000" />
          </div>

          <Input label="Endereço" name="endereco" value={formData.endereco} onChange={handleInputChange} placeholder="Endereço completo" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Contato Responsável" name="contato_responsavel" value={formData.contato_responsavel} onChange={handleInputChange} placeholder="Nome do responsável" />
            <Input label="Tipo de Serviço" name="tipo_servico" value={formData.tipo_servico} onChange={handleInputChange} placeholder="Ex: Equipamentos, Terceirizado" />
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
            <Button type="submit" isLoading={isLoading}>{editingFornecedor ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fornecedores;