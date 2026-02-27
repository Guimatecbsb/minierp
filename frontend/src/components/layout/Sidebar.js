import React, { useState } from 'react';
import { 
  Home, Settings, Package, ShoppingCart, Truck, 
  Wrench, ClipboardList, Calendar, FileText,
  Users, Building, Database, ChevronDown, ChevronRight,
  Thermometer, Zap, CheckSquare, HardHat, Box,
  Tool, AlertCircle, Archive, UserCog, Shield,
  Download, Server, Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'principal',
      title: '🏠 PRINCIPAL',
      icon: Home,
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/agenda-dia', label: 'Agenda do Dia', icon: Calendar },
        { path: '/alertas', label: 'Alertas', icon: AlertCircle },
        { path: '/eventos', label: 'Eventos do Dia', icon: Activity }
      ]
    },
    {
      id: 'operacional',
      title: '⚙️ OPERACIONAL',
      icon: Wrench,
      items: [
        { path: '/operacional/cadastro-atividades', label: 'Cadastro Atividades', icon: ClipboardList },
        { path: '/operacional/camarins', label: 'Camarins', icon: Building },
        { path: '/operacional/ar-condicionado', label: 'Ar Condicionado', icon: Thermometer },
        { path: '/operacional/eletrica', label: 'Elétrica', icon: Zap },
        { path: '/operacional/checklists', label: 'Checklists', icon: CheckSquare },
        { path: '/operacional/agenda', label: 'Agenda', icon: Calendar },
        { path: '/operacional/relatorios', label: 'Relatórios', icon: FileText }
      ]
    },
    {
      id: 'logistica',
      title: '🚚 LOGÍSTICA',
      icon: Truck,
      items: [
        { path: '/logistica/veiculos-pesados', label: 'Veículos Pesados', icon: Truck },
        { path: '/logistica/veiculos-leves', label: 'Veículos Leves', icon: Truck },
        { path: '/logistica/manutencao-preventiva', label: 'Manutenção Preventiva', icon: Wrench },
        { path: '/logistica/manutencao-corretiva', label: 'Manutenção Corretiva', icon: Tool },
        { path: '/logistica/abastecimento', label: 'Abastecimento', icon: Activity },
        { path: '/logistica/condutores', label: 'Cadastro de Condutores', icon: Users },
        { path: '/logistica/relatorios', label: 'Relatórios PDF', icon: FileText },
        { path: '/serralheria/entradas', label: 'Serralheria - Entradas', icon: Archive },
        { path: '/serralheria/saidas', label: 'Serralheria - Saídas', icon: Package },
        { path: '/serralheria/estoque', label: 'Serralheria - Estoque', icon: Database },
        { path: '/serralheria/equipamentos', label: 'Serralheria - Equipamentos', icon: Tool }
      ]
    },
    {
      id: 'estoque',
      title: '📦 ESTOQUE',
      icon: Package,
      items: [
        { path: '/estoque/cadastro-equipamentos', label: 'Cadastro Equipamentos', icon: Package },
        { path: '/estoque/tomados-emprestado', label: 'Tomados Emprestado', icon: Box },
        { path: '/estoque/emprestados-terceiro', label: 'Emprestados a Terceiro', icon: Box },
        { path: '/estoque/consumiveis', label: 'Consumíveis', icon: Archive },
        { path: '/estoque/catalogo', label: 'Catálogo Geral', icon: FileText },
        { path: '/estoque/inventario', label: 'Inventário Geral', icon: ClipboardList },
        { path: '/estoque/ferramentas', label: 'Ferramentas', icon: Tool },
        { path: '/estoque/epi', label: 'EPI', icon: HardHat }
      ]
    },
    {
      id: 'compras',
      title: '🛒 COMPRAS',
      icon: ShoppingCart,
      items: [
        { path: '/compras/ordens', label: 'Ordens de Compra', icon: ShoppingCart },
        { path: '/compras/orcamentos', label: 'Orçamentos', icon: FileText },
        { path: '/compras/historico', label: 'Histórico', icon: Archive },
        { path: '/compras/fornecedores', label: 'Fornecedores', icon: Building },
        { path: '/compras/servicos-terceirizados', label: 'Serviços Terceirizados', icon: Users },
        { path: '/compras/relatorios', label: 'Relatórios', icon: FileText }
      ]
    },
    {
      id: 'configuracoes',
      title: '⚙️ CONFIGURAÇÕES',
      icon: Settings,
      items: [
        { path: '/config/usuarios', label: 'Usuários', icon: Users },
        { path: '/config/permissoes', label: 'Permissões', icon: Shield },
        { path: '/config/empresa', label: 'Empresa', icon: Building },
        { path: '/config/backup', label: 'Backup e Restauração', icon: Download },
        { path: '/config/status-sistema', label: 'Status do Sistema', icon: Server },
        { path: '/config/usuarios-online', label: 'Usuários Online', icon: Activity }
      ]
    }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-[#161B22] border-r border-[#30363D] transition-all duration-300 z-50 overflow-y-auto ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Area */}
      <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <Building className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-lg font-bold text-white">JB Estruturas</h1>
              <p className="text-xs text-gray-400">ERP System</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Building className="w-8 h-8 text-blue-500 mx-auto" />
        )}
      </div>

      {/* Menu Items */}
      <nav className="p-2 space-y-1">
        {menuItems.map((menu) => (
          <div key={menu.id}>
            {/* Menu Header */}
            <button
              onClick={() => toggleMenu(menu.id)}
              className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-[#1F2937] rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                {!isCollapsed && (
                  <span className="text-sm font-semibold">{menu.title}</span>
                )}
              </div>
              {!isCollapsed && (
                openMenus[menu.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Submenu Items */}
            {(openMenus[menu.id] || isCollapsed) && (
              <div className={`${isCollapsed ? '' : 'ml-2'} space-y-1`}>
                {menu.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      data-testid={`menu-${item.path.replace(/\//g, '-')}`}
                      className={`flex items-center space-x-3 p-2.5 rounded-md transition-all sidebar-item ${
                        isActive 
                          ? 'active text-blue-400 bg-[#1F2937]' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;