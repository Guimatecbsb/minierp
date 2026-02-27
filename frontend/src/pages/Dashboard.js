import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock, TrendingUp, Package, Users, Truck } from 'lucide-react';
import { dashboardService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral do sistema</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Hoje</p>
          <p className="text-lg font-semibold text-white">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Eventos Hoje</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.eventos.hoje}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stats.eventos.andamento} em andamento
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-green-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Equipamentos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.contadores.equipamentos}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                {stats.contadores.equipamentos_disponiveis} disponíveis
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-yellow-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Veículos</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.contadores.veiculos}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                {stats.contadores.veiculos_ativos} ativos
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-red-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alertas</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.alertas.length}</p>
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Requer atenção
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.contadores.clientes}</p>
          <p className="text-sm text-gray-400">Clientes</p>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.contadores.fornecedores}</p>
          <p className="text-sm text-gray-400">Fornecedores</p>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.eventos.programados}</p>
          <p className="text-sm text-gray-400">Programados</p>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.eventos.andamento}</p>
          <p className="text-sm text-gray-400">Em Andamento</p>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda do Dia */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Eventos de Hoje
          </h2>
          {stats.eventos.lista_dia.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum evento programado para hoje</p>
          ) : (
            <div className="space-y-3">
              {stats.eventos.lista_dia.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-[#0D1117] rounded-lg hover:bg-[#1F2937] transition-colors">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Horário</p>
                    <p className="text-sm font-semibold text-white">{item.hora_inicio || '--:--'}</p>
                  </div>
                  <div className="w-1 h-12 bg-blue-500 rounded"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.titulo}</p>
                    <p className="text-sm text-gray-400">{item.local}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'andamento' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'programado' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Alertas
          </h2>
          {stats.alertas.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">Nenhum alerta no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.alertas.map((alerta, idx) => (
                <div key={idx} className={`p-3 rounded-lg border ${
                  alerta.tipo === 'error' ? 'bg-red-500/10 border-red-500/20' :
                  alerta.tipo === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alerta.tipo === 'error' ? 'text-red-400' :
                      alerta.tipo === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div>
                      <p className="text-white font-medium text-sm">{alerta.titulo}</p>
                      <p className="text-gray-400 text-xs mt-1">{alerta.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
        <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium">
            + Novo Evento
          </button>
          <button className="p-4 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-white font-medium">
            + Cadastrar Cliente
          </button>
          <button className="p-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors text-white font-medium">
            + Registrar Abastecimento
          </button>
          <button className="p-4 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-white font-medium">
            + Novo Equipamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral do sistema</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Hoje</p>
          <p className="text-lg font-semibold text-white">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Eventos Hoje</p>
              <p className="text-3xl font-bold text-white mt-2">8</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% vs ontem
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-green-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Em Andamento</p>
              <p className="text-3xl font-bold text-white mt-2">3</p>
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Ativo
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-yellow-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Programados</p>
              <p className="text-3xl font-bold text-white mt-2">5</p>
              <p className="text-yellow-400 text-sm mt-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Aguardando
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated hover:border-red-500 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alertas</p>
              <p className="text-3xl font-bold text-white mt-2">2</p>
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Requer atenção
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda do Dia */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Agenda do Dia
          </h2>
          <div className="space-y-3">
            {[
              { time: '08:00', title: 'Montagem Evento - Teatro Municipal', status: 'andamento', color: 'green' },
              { time: '10:30', title: 'Vistoria Equipamentos - Local XYZ', status: 'programado', color: 'yellow' },
              { time: '14:00', title: 'Desmontagem - Centro de Convenções', status: 'programado', color: 'blue' },
              { time: '16:00', title: 'Manutenção Preventiva Veículos', status: 'programado', color: 'blue' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 bg-[#0D1117] rounded-lg hover:bg-[#1F2937] transition-colors">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Horário</p>
                  <p className="text-sm font-semibold text-white">{item.time}</p>
                </div>
                <div className={`w-1 h-12 bg-${item.color}-500 rounded`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-gray-400 capitalize">{item.status}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  item.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Alertas
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Manutenção Atrasada</p>
                  <p className="text-gray-400 text-xs mt-1">Veículo ABC-1234 precisa de manutenção preventiva</p>
                  <p className="text-red-400 text-xs mt-1">Há 5 dias</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Estoque Baixo</p>
                  <p className="text-gray-400 text-xs mt-1">EPIs abaixo do nível mínimo</p>
                  <p className="text-yellow-400 text-xs mt-1">Reabastecer</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Evento Próximo</p>
                  <p className="text-gray-400 text-xs mt-1">Festival de Música - Preparação amanhã</p>
                  <p className="text-blue-400 text-xs mt-1">Em 1 dia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 card-elevated">
        <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium">
            + Novo Evento
          </button>
          <button className="p-4 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-white font-medium">
            + Cadastrar Cliente
          </button>
          <button className="p-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors text-white font-medium">
            + Ordem de Compra
          </button>
          <button className="p-4 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-white font-medium">
            + Agendar Manutenção
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;