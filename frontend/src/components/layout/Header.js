import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#1F2937] rounded-md transition-colors"
          data-testid="toggle-sidebar-btn"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">JB Estruturas e Eventos</h2>
          <p className="text-xs text-gray-400">CNPJ: 48.950.114/0001-29</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button 
          className="relative p-2 hover:bg-[#1F2937] rounded-md transition-colors"
          data-testid="notifications-btn"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3 px-3 py-2 hover:bg-[#1F2937] rounded-md transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">Administrador</p>
            <p className="text-xs text-gray-400">admin@jbestruturas.com</p>
          </div>
        </div>

        {/* Logout */}
        <button 
          className="p-2 hover:bg-[#1F2937] rounded-md transition-colors"
          data-testid="logout-btn"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;