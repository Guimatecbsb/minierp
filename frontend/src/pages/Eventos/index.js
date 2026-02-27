import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Edit, Trash2, MapPin } from 'lucide-react';
import { eventosService, clientesService } from '@/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: '',
    data_evento: '',
    hora_inicio: '',
    hora_fim: '',
    local: '',
    tipo_evento: '',
    status: 'programado',
    observacoes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = eventos;
    
    if (searchTerm) {
      filtered = filtered.filter((e) =>
        e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.local.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredEventos(filtered);
  }, [searchTerm, filterStatus, eventos]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [eventosData, clientesData] = await Promise.all([
        eventosService.getAll(),
        clientesService.getAll(),
      ]);
      setEventos(eventosData);
      setFilteredEventos(eventosData);
      setClientes(clientesData);
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

  const handleOpenModal = (evento = null) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        titulo: evento.titulo,
        cliente_id: evento.cliente_id,
        data_evento: evento.data_evento,
        hora_inicio: evento.hora_inicio || '',
        hora_fim: evento.hora_fim || '',
        local: evento.local,
        tipo_evento: evento.tipo_evento || '',
        status: evento.status,
        observacoes: evento.observacoes || '',
      });
    } else {
      setEditingEvento(null);
      setFormData({
        titulo: '',
        cliente_id: '',
        data_evento: '',
        hora_inicio: '',
        hora_fim: '',
        local: '',
        tipo_evento: '',
        status: 'programado',
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvento(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingEvento) {
        await eventosService.update(editingEvento.id, formData);
        showToast('success', 'Evento atualizado com sucesso!');
      } else {
        await eventosService.create(formData);
        showToast('success', 'Evento criado com sucesso!');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      showToast('error', 'Erro ao salvar evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      await eventosService.delete(id);
      showToast('success', 'Evento excluído com sucesso!');
      loadData();
    } catch (error) {
      showToast('error', 'Erro ao excluir evento');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'programado': 'bg-blue-500/20 text-blue-400',
      'andamento': 'bg-green-500/20 text-green-400',
      'finalizado': 'bg-gray-500/20 text-gray-400',
      'cancelado': 'bg-red-500/20 text-red-400',
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getClienteNome = (cliente_id) => {
    const cliente = clientes.find((c) => c.id === cliente_id);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="eventos-title">Eventos</h1>
          <p className="text-gray-400 mt-1">Gerenciamento de eventos e apresentações</p>
        </div>
        <Button onClick={() => handleOpenModal()} data-testid="add-evento-btn">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por título ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="programado">Programado</option>
            <option value="andamento">Em Andamento</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D1117] border-b border-[#30363D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Carregando...</td>
                </tr>
              ) : filteredEventos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Nenhum evento encontrado</td>
                </tr>
              ) : (
                filteredEventos.map((evento) => (
                  <tr key={evento.id} className="hover:bg-[#1F2937] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(evento.data_evento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{evento.titulo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getClienteNome(evento.cliente_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        {evento.local}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {evento.hora_inicio && evento.hora_fim ? `${evento.hora_inicio} - ${evento.hora_fim}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(evento.status)}`}>
                        {evento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(evento)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(evento.id)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEvento ? 'Editar Evento' : 'Novo Evento'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título do Evento" name="titulo" value={formData.titulo} onChange={handleInputChange} required placeholder="Nome do evento" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cliente <span className="text-red-400">*</span></label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <Input label="Tipo de Evento" name="tipo_evento" value={formData.tipo_evento} onChange={handleInputChange} placeholder="Show, Teatro, etc" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Data" name="data_evento" type="date" value={formData.data_evento} onChange={handleInputChange} required />
            <Input label="Hora Início" name="hora_inicio" type="time" value={formData.hora_inicio} onChange={handleInputChange} />
            <Input label="Hora Fim" name="hora_fim" type="time" value={formData.hora_fim} onChange={handleInputChange} />
          </div>

          <Input label="Local" name="local" value={formData.local} onChange={handleInputChange} required placeholder="Endereço do evento" />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="programado">Programado</option>
              <option value="andamento">Em Andamento</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
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
            <Button type="submit" isLoading={isLoading}>{editingEvento ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Eventos;
