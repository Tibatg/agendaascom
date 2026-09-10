import React from 'react';
import { 
  Calendar as CalendarIcon, 
  LogIn, 
  LogOut, 
  User, 
  Plus, 
  Wifi, 
  WifiOff, 
  Clock, 
  RefreshCw, 
  BarChart3, 
  FolderOpen, 
  FileText, 
  HardDrive, 
  Users, 
  History
} from 'lucide-react';
import { TabType, UserProfile, HeaderFooterConfig } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncDate: string;
  onSync: () => void;
  currentUser: UserProfile;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onNewActionClick: () => void;
  layoutConfig: HeaderFooterConfig;
  totalAcoes: number;
  totalSecretarias: number;
  totalResponsaveis: number;
  totalArquivos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  isSyncing,
  lastSyncDate,
  onSync,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onNewActionClick,
  layoutConfig,
  totalAcoes,
  totalSecretarias,
  totalResponsaveis,
  totalArquivos,
}) => {
  const isSuperAdmin = currentUser.perfil === 'Administrador';
  const isViewer = currentUser.perfil === 'Visualizador';

  return (
    <header className="sticky top-0 z-30 shadow-xs">
      {/* Top Institutional Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide text-white uppercase">Prefeitura Municipal</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline">{layoutConfig.faixaSuperior}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Online/Offline Status Indicator */}
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Wifi className="w-3.5 h-3.5" /> Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                  <WifiOff className="w-3.5 h-3.5" /> Modo Offline
                </span>
              )}
            </div>

            {/* Sync Timestamp Indicator */}
            <div className="hidden sm:flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-2">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Sincronizado: <strong>{lastSyncDate}</strong></span>
            </div>

            {/* Manual Sync Trigger */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-0.5 rounded border border-slate-700 font-bold transition-all disabled:opacity-50 cursor-pointer"
              title="Sincronizar dados em tempo real"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-300' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>

            {/* Active Profile */}
            <div className="border-l border-slate-700 pl-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                currentUser.perfil === 'Administrador' ? 'bg-blue-600 text-white' :
                currentUser.perfil === 'Editor' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
              }`}>
                {currentUser.perfil}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo and Titles */}
          <div 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {layoutConfig.portalLogoUrl ? (
              <img 
                src={layoutConfig.portalLogoUrl} 
                alt="Brasão" 
                className="w-11 h-11 object-contain rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <CalendarIcon className="w-6 h-6 text-amber-300" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  {layoutConfig.portalTitulo}
                </h1>
                <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-300 dark:border-amber-800">
                  OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {layoutConfig.portalSubtitulo}
              </p>
            </div>
          </div>

          {/* User Session Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isViewer ? (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar para editar</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                      {currentUser.nome}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Perfil: <strong className="text-blue-600 dark:text-blue-400">{currentUser.perfil}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onNewActionClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Nova Ação</span>
                </button>

                <button
                  onClick={onLogoutClick}
                  title="Sair do perfil administrativo"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="bg-slate-100/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'inicio' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('calendario-geral')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'calendario-geral' || activeTab === 'calendario-secretaria' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Calendário
            </button>
            <button
              onClick={() => setActiveTab('acoes')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'acoes' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Ações ({totalAcoes})
            </button>
            <button
              onClick={() => setActiveTab('secretarias')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'secretarias' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Secretarias ({totalSecretarias})
            </button>
            <button
              onClick={() => setActiveTab('responsaveis')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'responsaveis' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Responsáveis ({totalResponsaveis})
            </button>
            <button
              onClick={() => setActiveTab('arquivos')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'arquivos' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Arquivos ({totalArquivos})</span>
            </button>
            <button
              onClick={() => setActiveTab('pesquisa')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'pesquisa' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Pesquisar
            </button>
            <button
              onClick={() => setActiveTab('relatorios')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'relatorios' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Relatórios</span>
            </button>

            {/* Admin Management Tools */}
            {isSuperAdmin && (
              <>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                <button
                  onClick={() => setActiveTab('backup')}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'backup' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                  <span>Backup JSON</span>
                </button>
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'usuarios' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuários</span>
                </button>
                <button
                  onClick={() => setActiveTab('auditoria')}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'auditoria' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span>Auditoria</span>
                </button>
                <button
                  onClick={() => setActiveTab('config-supabase')}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'config-supabase' ? 'bg-blue-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Banco & SQL
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
