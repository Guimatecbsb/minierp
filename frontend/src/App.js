import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Clientes from '@/pages/Clientes';
import Fornecedores from '@/pages/Fornecedores';
import Equipamentos from '@/pages/Equipamentos';
import Veiculos from '@/pages/Veiculos';
import Condutores from '@/pages/Condutores';
import Abastecimento from '@/pages/Abastecimento';
import Eventos from '@/pages/Eventos';
import BackupRestore from '@/pages/BackupRestore';
import OrdensDeCompra from '@/pages/Compras/OrdensDeCompra';
import Orcamentos from '@/pages/Compras/Orcamentos';
import Emprestimos from '@/pages/Estoque/Emprestimos';
import EPIs from '@/pages/Estoque/EPIs';
import Checklists from '@/pages/Operacional/Checklists';
import MovimentacoesSerralheria from '@/pages/Serralheria/Movimentacoes';
import EstoqueSerralheria from '@/pages/Serralheria/Estoque';
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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login (sem layout) */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas (com layout) */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
            {/* Principal */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agenda-dia" element={<PlaceholderPage title="Agenda do Dia" description="Visualização completa da agenda diária" />} />
            <Route path="/alertas" element={<PlaceholderPage title="Alertas" description="Central de alertas e notificações" />} />
            <Route path="/eventos" element={<Eventos />} />
            
            {/* Operacional */}
            <Route path="/operacional/cadastro-atividades" element={<PlaceholderPage title="Cadastro de Atividades" description="Gerenciamento de atividades operacionais" />} />
            <Route path="/operacional/camarins" element={<PlaceholderPage title="Camarins" description="Controle de camarins" />} />
            <Route path="/operacional/ar-condicionado" element={<PlaceholderPage title="Ar Condicionado" description="Gestão de equipamentos de ar condicionado" />} />
            <Route path="/operacional/eletrica" element={<PlaceholderPage title="Elétrica" description="Controle de instalações elétricas" />} />
            <Route path="/operacional/checklists" element={<Checklists />} />
            <Route path="/operacional/agenda" element={<PlaceholderPage title="Agenda" description="Agenda semanal e mensal" />} />
            <Route path="/operacional/relatorios" element={<PlaceholderPage title="Relatórios Operacionais" description="Relatórios do setor operacional" />} />
            
            {/* Logística */}
            <Route path="/logistica/veiculos-pesados" element={<Veiculos />} />
            <Route path="/logistica/veiculos-leves" element={<Veiculos />} />
            <Route path="/logistica/manutencao-preventiva" element={<PlaceholderPage title="Manutenção Preventiva" description="Programação de manutenções preventivas" />} />
            <Route path="/logistica/manutencao-corretiva" element={<PlaceholderPage title="Manutenção Corretiva" description="Registro de manutenções corretivas" />} />
            <Route path="/logistica/abastecimento" element={<Abastecimento />} />
            <Route path="/logistica/condutores" element={<Condutores />} />
            <Route path="/logistica/relatorios" element={<PlaceholderPage title="Relatórios Logística" description="Relatórios em PDF da logística" />} />
            
            {/* Serralheria */}
            <Route path="/serralheria/entradas" element={<MovimentacoesSerralheria />} />
            <Route path="/serralheria/saidas" element={<MovimentacoesSerralheria />} />
            <Route path="/serralheria/estoque" element={<EstoqueSerralheria />} />
            <Route path="/serralheria/equipamentos" element={<PlaceholderPage title="Serralheria - Equipamentos" description="Equipamentos disponíveis/indisponíveis" />} />
            
            {/* Estoque */}
            <Route path="/estoque/cadastro-equipamentos" element={<Equipamentos />} />
            <Route path="/estoque/tomados-emprestado" element={<Emprestimos />} />
            <Route path="/estoque/emprestados-terceiro" element={<Emprestimos />} />
            <Route path="/estoque/consumiveis" element={<PlaceholderPage title="Consumíveis" description="Gestão de materiais consumíveis" />} />
            <Route path="/estoque/catalogo" element={<PlaceholderPage title="Catálogo Geral" description="Catálogo completo de equipamentos" />} />
            <Route path="/estoque/inventario" element={<PlaceholderPage title="Inventário Geral" description="Inventário completo do estoque" />} />
            <Route path="/estoque/ferramentas" element={<PlaceholderPage title="Ferramentas" description="Controle de ferramentas" />} />
            <Route path="/estoque/epi" element={<EPIs />} />
            
            {/* Compras */}
            <Route path="/compras/ordens" element={<OrdensDeCompra />} />
            <Route path="/compras/orcamentos" element={<Orcamentos />} />
            <Route path="/compras/historico" element={<PlaceholderPage title="Histórico" description="Histórico de compras com relatório PDF" />} />
            <Route path="/compras/fornecedores" element={<Fornecedores />} />
            <Route path="/compras/servicos-terceirizados" element={<PlaceholderPage title="Serviços Terceirizados" description="Controle de serviços terceirizados" />} />
            <Route path="/compras/relatorios" element={<PlaceholderPage title="Relatórios Compras" description="Relatórios do setor de compras" />} />
            
            {/* Configurações */}
            <Route path="/config/usuarios" element={<PlaceholderPage title="Usuários" description="Criar, editar, excluir e gerenciar permissões" />} />
            <Route path="/config/permissoes" element={<PlaceholderPage title="Permissões" description="Controle de permissões (somente Admin)" />} />
            <Route path="/config/empresa" element={<PlaceholderPage title="Empresa" description="Configurações da empresa e upload de logo" />} />
            <Route path="/config/backup" element={<BackupRestore />} />
            <Route path="/config/status-sistema" element={<PlaceholderPage title="Status do Sistema" description="Monitoramento do status do sistema" />} />
            <Route path="/config/usuarios-online" element={<PlaceholderPage title="Usuários Online" description="Visualização de usuários conectados" />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>
    </div>
  );
}

export default App;