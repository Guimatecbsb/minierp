import React, { useState, useEffect } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { backupService } from '@/services';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

const BackupRestore = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await backupService.getStats();
      setStats(data);
    } catch (error) {
      showToast('error', 'Erro ao carregar estatísticas');
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportBackup = async () => {
    setIsLoading(true);
    try {
      await backupService.exportBackup();
      showToast('success', 'Backup exportado com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao exportar backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      showToast('error', 'Selecione um arquivo de backup');
      return;
    }

    if (!window.confirm('⚠️ ATENÇÃO: Restaurar o backup irá SUBSTITUIR TODOS os dados atuais. Deseja continuar?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await backupService.restoreBackup(selectedFile);
      showToast('success', `Backup restaurado! ${result.collections_restored.length} coleções restauradas.`);
      setSelectedFile(null);
      loadStats();
    } catch (error) {
      showToast('error', 'Erro ao restaurar backup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Backup e Restauração</h1>
        <p className="text-gray-400 mt-1">Faça backup completo dos dados do sistema</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Collections</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total_collections}</p>
              </div>
              <Database className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Documentos</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total_documents}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Último Backup</p>
                <p className="text-sm text-gray-300 mt-2">Nunca</p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Collections Details */}
      {stats && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Dados por Coleção</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.collections).map(([collection, count]) => (
              <div key={collection} className="bg-[#0D1117] p-4 rounded-lg">
                <p className="text-gray-400 text-sm capitalize">{collection}</p>
                <p className="text-2xl font-bold text-white mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Backup */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Exportar Backup</h2>
            <p className="text-gray-400 mb-4">
              Faça o download de um backup completo de todos os dados do sistema em formato JSON.
              Este arquivo pode ser usado para restaurar o sistema em caso de perda de dados.
            </p>
            <Button 
              onClick={handleExportBackup} 
              isLoading={isLoading}
              data-testid="export-backup-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Fazer Backup Completo
            </Button>
          </div>
        </div>
      </div>

      {/* Restore Backup */}
      <div className="bg-[#161B22] border border-red-500/20 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Upload className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Restaurar Backup</h2>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm">⚠️ ATENÇÃO - OPERAÇÃO CRÍTICA</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Restaurar um backup irá <strong>SUBSTITUIR TODOS</strong> os dados atuais do sistema.
                    Esta operação não pode ser desfeita. Certifique-se de que o arquivo de backup está correto.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selecione o arquivo de backup (.json)
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Arquivo selecionado: <span className="text-white">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              <Button 
                variant="danger"
                onClick={handleRestoreBackup} 
                isLoading={isLoading}
                disabled={!selectedFile}
                data-testid="restore-backup-btn"
              >
                <Upload className="w-4 h-4 mr-2" />
                Restaurar Backup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
