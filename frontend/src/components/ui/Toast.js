import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    error: {
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    info: {
      icon: Info,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  };

  const { icon: Icon, color, bgColor, borderColor } = config[type];

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg border ${bgColor} ${borderColor} shadow-lg min-w-[300px] animate-slide-in`}>
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-white flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export default Toast;