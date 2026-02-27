import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Clientes from '@/pages/Clientes';
import '@/App.css';

// Placeholder component for pages under construction
const PlaceholderPage = ({ title, description }) => (
  <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-8 text-center card-elevated">
    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
    <p className="text-gray-400">{description}</p>
    <div className="mt-6 inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
      Módulo em construção - FASE 3+
    </div>
  </div>
);

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Principal */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agenda-dia" element={<PlaceholderPage title="Agenda do Dia" description="Visualização completa da agenda diária" />} />
            <Route path="/alertas" element={<PlaceholderPage title="Alertas" description="Central de alertas e notificações" />} />
            <Route path="/eventos" element={<PlaceholderPage title="Eventos do Dia" description="Gestão de eventos em andamento, programados e finalizados" />} />
            
            {/* Operacional */}
            <Route path="/operacional/cadastro-atividades" element={<PlaceholderPage title="Cadastro de Atividades" description="Gerenciamento de atividades operacionais" />} />
            <Route path="/operacional/camarins" element={<PlaceholderPage title="Camarins" description="Controle de camarins" />} />
            <Route path="/operacional/ar-condicionado" element={<PlaceholderPage title="Ar Condicionado" description="Gestão de equipamentos de ar condicionado" />} />
            <Route path="/operacional/eletrica" element={<PlaceholderPage title="Elétrica" description="Controle de instalações elétricas" />} />
            <Route path="/operacional/checklists" element={<PlaceholderPage title="Checklists" description="Checklists operacionais" />} />
            <Route path="/operacional/agenda" element={<PlaceholderPage title="Agenda" description="Agenda semanal e mensal" />} />
            <Route path="/operacional/relatorios" element={<PlaceholderPage title="Relatórios Operacionais" description="Relatórios do setor operacional" />} />
            
            {/* Logística */}
            <Route path="/logistica/veiculos-pesados" element={<PlaceholderPage title="Veículos Pesados" description="Gestão de veículos pesados" />} />
            <Route path="/logistica/veiculos-leves" element={<PlaceholderPage title="Veículos Leves" description="Gestão de veículos leves" />} />
            <Route path="/logistica/manutencao-preventiva" element={<PlaceholderPage title="Manutenção Preventiva" description="Programação de manutenções preventivas" />} />
            <Route path="/logistica/manutencao-corretiva" element={<PlaceholderPage title="Manutenção Corretiva" description="Registro de manutenções corretivas" />} />
            <Route path="/logistica/abastecimento" element={<PlaceholderPage title="Abastecimento" description="Controle de abastecimento com numeração automática" />} />
            <Route path="/logistica/condutores" element={<PlaceholderPage title="Cadastro de Condutores" description="Cadastro e gestão de condutores" />} />
            <Route path="/logistica/relatorios" element={<PlaceholderPage title="Relatórios Logística" description="Relatórios em PDF da logística" />} />
            
            {/* Serralheria */}
            <Route path="/serralheria/entradas" element={<PlaceholderPage title="Serralheria - Entradas" description="Registro de entradas na serralheria" />} />
            <Route path="/serralheria/saidas" element={<PlaceholderPage title="Serralheria - Saídas" description="Registro de saídas da serralheria" />} />
            <Route path="/serralheria/estoque" element={<PlaceholderPage title="Serralheria - Estoque" description="Controle de estoque da serralheria" />} />
            <Route path="/serralheria/equipamentos" element={<PlaceholderPage title="Serralheria - Equipamentos" description="Equipamentos disponíveis/indisponíveis" />} />
            
            {/* Estoque */}
            <Route path="/estoque/cadastro-equipamentos" element={<PlaceholderPage title="Cadastro de Equipamentos" description="Cadastro e gestão de equipamentos" />} />
            <Route path="/estoque/tomados-emprestado" element={<PlaceholderPage title="Tomados Emprestado" description="Controle de itens tomados emprestado" />} />
            <Route path="/estoque/emprestados-terceiro" element={<PlaceholderPage title="Emprestados a Terceiro" description="Controle de itens emprestados" />} />
            <Route path="/estoque/consumiveis" element={<PlaceholderPage title="Consumíveis" description="Gestão de materiais consumíveis" />} />
            <Route path="/estoque/catalogo" element={<PlaceholderPage title="Catálogo Geral" description="Catálogo completo de equipamentos" />} />
            <Route path="/estoque/inventario" element={<PlaceholderPage title="Inventário Geral" description="Inventário completo do estoque" />} />
            <Route path="/estoque/ferramentas" element={<PlaceholderPage title="Ferramentas" description="Controle de ferramentas" />} />
            <Route path="/estoque/epi" element={<PlaceholderPage title="EPI" description="Equipamentos de Proteção Individual" />} />
            
            {/* Compras */}
            <Route path="/compras/ordens" element={<PlaceholderPage title="Ordens de Compra" description="Gestão de ordens de compra com numeração automática" />} />
            <Route path="/compras/orcamentos" element={<PlaceholderPage title="Orçamentos" description="Orçamentos: Pendente/Aprovado/Negado" />} />
            <Route path="/compras/historico" element={<PlaceholderPage title="Histórico" description="Histórico de compras com relatório PDF" />} />
            <Route path="/compras/fornecedores" element={<PlaceholderPage title="Fornecedores" description="Cadastro e gestão de fornecedores" />} />
            <Route path="/compras/servicos-terceirizados" element={<PlaceholderPage title="Serviços Terceirizados" description="Controle de serviços terceirizados" />} />
            <Route path="/compras/relatorios" element={<PlaceholderPage title="Relatórios Compras" description="Relatórios do setor de compras" />} />
            
            {/* Configurações */}
            <Route path="/config/usuarios" element={<PlaceholderPage title="Usuários" description="Criar, editar, excluir e gerenciar permissões" />} />
            <Route path="/config/permissoes" element={<PlaceholderPage title="Permissões" description="Controle de permissões (somente Admin)" />} />
            <Route path="/config/empresa" element={<PlaceholderPage title="Empresa" description="Configurações da empresa e upload de logo" />} />
            <Route path="/config/backup" element={<PlaceholderPage title="Backup e Restauração" description="Backup completo e restore com 1 clique" />} />
            <Route path="/config/status-sistema" element={<PlaceholderPage title="Status do Sistema" description="Monitoramento do status do sistema" />} />
            <Route path="/config/usuarios-online" element={<PlaceholderPage title="Usuários Online" description="Visualização de usuários conectados" />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;