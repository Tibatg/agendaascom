import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

import { 
  Secretariat, 
  MunicipalAction, 
  UserProfile, 
  AuditLog, 
  HeaderFooterConfig, 
  TabType, 
  ActionStatus,
  ActionAttachment,
  ActionHistory
} from './types';

import { 
  INITIAL_SECRETARIAS, 
  INITIAL_ACTIONS, 
  INITIAL_USERS, 
  INITIAL_LAYOUT 
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { InicioTab } from './components/InicioTab';
import { DashboardTab } from './components/DashboardTab';
import { CalendarTab } from './components/CalendarTab';
import { ActionsTab } from './components/ActionsTab';
import { SecretariatsTab } from './components/SecretariatsTab';
import { ResponsaveisTab } from './components/ResponsaveisTab';
import { ArquivosTab } from './components/ArquivosTab';
import { PesquisaTab } from './components/PesquisaTab';
import { RelatoriosTab } from './components/RelatoriosTab';
import { BackupTab } from './components/BackupTab';
import { UsuariosTab } from './components/UsuariosTab';
import { AuditoriaTab } from './components/AuditoriaTab';
import { SupabaseConfigTab } from './components/SupabaseConfigTab';

import { DayDetailsModal } from './components/modals/DayDetailsModal';
import { ActionDetailModal } from './components/modals/ActionDetailModal';
import { ActionFormModal } from './components/modals/ActionFormModal';
import { GoogleSyncModal } from './components/modals/GoogleSyncModal';
import { LoginModal } from './components/modals/LoginModal';
import { SecretariaModal } from './components/modals/SecretariaModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { RestoreConfirmModal } from './components/modals/RestoreConfirmModal';
import { fetchUsuariosFromSupabase, updateUsuarioPerfil, updateUsuarioStatus } from './lib/supabase';

export default function App() {
  /* Navigation Tab */
  const [activeTab, setActiveTab] = useState<TabType>('inicio');

  /* Online / Sync state */
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncDate, setLastSyncDate] = useState<string>('10/09/2026 16:14');

  /* Core Municipal State with LocalStorage Caching */
  const [secretarias, setSecretarias] = useState<Secretariat[]>(() => {
    const cached = localStorage.getItem('cal_acoes_secretarias');
    return cached ? JSON.parse(cached) : INITIAL_SECRETARIAS;
  });

  const [acoes, setAcoes] = useState<MunicipalAction[]>(() => {
    const cached = localStorage.getItem('cal_acoes_data');
    return cached ? JSON.parse(cached) : INITIAL_ACTIONS;
  });

  const [usuarios, setUsuarios] = useState<UserProfile[]>(() => {
    const cached = localStorage.getItem('cal_acoes_usuarios');
    return cached ? JSON.parse(cached) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[2]); // Starts as Visualizador
  const [layoutConfig] = useState<HeaderFooterConfig>(INITIAL_LAYOUT);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const cached = localStorage.getItem('cal_acoes_audit');
    return cached ? JSON.parse(cached) : [
      {
        id: 'log-init-1',
        usuario_nome: 'Sistema Municipal',
        usuario_email: 'sistema@prefeitura.gov.br',
        perfil: 'Administrador',
        acao_realizada: 'Inicialização do Calendário Oficial',
        registro_alterado: 'Módulos Governamentais',
        tipo_operacao: 'SYNC',
        dados_relevantes: '8 Secretarias e 8 Ações carregadas',
        created_at: '2026-09-10 08:00:00'
      }
    ];
  });

  /* Selected Secretariat for dedicated calendar view */
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string>('sec-cultura');

  /* Modals State */
  const [dayDetailsModalOpen, setDayDetailsModalOpen] = useState<boolean>(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);

  const [actionFormModalOpen, setActionFormModalOpen] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<MunicipalAction | null>(null);
  const [actionFormDefaultDate, setActionFormDefaultDate] = useState<string | undefined>(undefined);
  const [actionFormDefaultSecId, setActionFormDefaultSecId] = useState<string | undefined>(undefined);

  const [actionDetailModalOpen, setActionDetailModalOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<MunicipalAction | null>(null);

  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
  const [actionToDelete, setActionToDelete] = useState<MunicipalAction | null>(null);

  const [secretariaModalOpen, setSecretariaModalOpen] = useState<boolean>(false);
  const [editingSecretaria, setEditingSecretaria] = useState<Secretariat | null>(null);

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loginIntentMessage, setLoginIntentMessage] = useState<string>('');

  const [googleSyncModalOpen, setGoogleSyncModalOpen] = useState<boolean>(false);
  const [actionForGoogle, setActionForGoogle] = useState<MunicipalAction | null>(null);

  const [restoreConfirmModalOpen, setRestoreConfirmModalOpen] = useState<boolean>(false);
  const [parsedBackupData, setParsedBackupData] = useState<any | null>(null);

  /* Toast notification */
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  /* Save to LocalStorage */
  useEffect(() => {
    localStorage.setItem('cal_acoes_secretarias', JSON.stringify(secretarias));
  }, [secretarias]);

  useEffect(() => {
    localStorage.setItem('cal_acoes_data', JSON.stringify(acoes));
  }, [acoes]);

  useEffect(() => {
    localStorage.setItem('cal_acoes_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('cal_acoes_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  /* Online / Offline listener */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /* User Permissions */
  const isSuperAdmin = currentUser.perfil === 'Administrador';
  const isEditor = currentUser.perfil === 'Editor';
  const isViewer = currentUser.perfil === 'Visualizador';

  const canEditSecretaria = (secId: string) => {
    if (isSuperAdmin) return true;
    if (isEditor) {
      return !currentUser.secretaria_id || currentUser.secretaria_id === secId;
    }
    return false;
  };

  const promptLogin = (msg: string = 'Acesso restrito. Autentique-se como Administrador ou Editor.') => {
    setLoginIntentMessage(msg);
    setLoginModalOpen(true);
  };

  const logAudit = (
    acao: string, 
    registro: string, 
    tipo: 'INSERT' | 'UPDATE' | 'DELETE' | 'AUTH' | 'PERMISSION' | 'BACKUP' | 'SYNC', 
    detalhes?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      usuario_nome: currentUser.nome,
      usuario_email: currentUser.email,
      perfil: currentUser.perfil,
      acao_realizada: acao,
      registro_alterado: registro,
      tipo_operacao: tipo,
      dados_relevantes: detalhes,
      created_at: nowStr
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  /* Authentication Handlers */
  const handleLogin = (email: string, pass: string): boolean => {
    const emailTrim = email.trim().toLowerCase();
    const passTrim = pass.trim();

    if (emailTrim === 'ascomitapecuru@gmail.com' && (passTrim === 'ascom@2026' || passTrim === 'admin')) {
      const adminUser = usuarios.find(u => u.perfil === 'Administrador') || INITIAL_USERS[0];
      const updated = { ...adminUser, ultimo_acesso: new Date().toISOString().replace('T', ' ').slice(0, 16) };
      setCurrentUser(updated);
      setLoginModalOpen(false);
      logAudit('Login efetuado', 'Sessão iniciada', 'AUTH', 'Perfil: Administrador Geral');
      showToast(`Bem-vindo, ${updated.nome}! Acesso administrativo liberado.`, 'success');
      return true;
    }

    if ((emailTrim === 'editor@itapecuru.gov.br' || emailTrim === 'ascomitapecuru@gmail.com') && (passTrim === 'editor@2026' || passTrim === 'editor')) {
      const editorUser = usuarios.find(u => u.perfil === 'Editor') || INITIAL_USERS[1];
      const updated = { ...editorUser, ultimo_acesso: new Date().toISOString().replace('T', ' ').slice(0, 16) };
      setCurrentUser(updated);
      setLoginModalOpen(false);
      logAudit('Login efetuado', 'Sessão iniciada', 'AUTH', 'Perfil: Editor Setorial');
      showToast(`Bem-vindo, ${editorUser.nome}! Modo de edição ativado.`, 'success');
      return true;
    }

    return false;
  };

  const handleQuickLogin = (role: 'Administrador' | 'Editor') => {
    const target = usuarios.find(u => u.perfil === role) || (role === 'Administrador' ? INITIAL_USERS[0] : INITIAL_USERS[1]);
    const updated = { ...target, ultimo_acesso: new Date().toISOString().replace('T', ' ').slice(0, 16) };
    setCurrentUser(updated);
    setLoginModalOpen(false);
    logAudit('Acesso rápido selecionado', 'Sessão iniciada', 'AUTH', `Perfil: ${role}`);
    showToast(`Conectado como ${target.nome} (${role})`, 'success');
  };

  const handleLogout = () => {
    logAudit('Logout efetuado', 'Sessão encerrada', 'AUTH', currentUser.nome);
    const viewer = usuarios.find(u => u.perfil === 'Visualizador') || INITIAL_USERS[2];
    setCurrentUser(viewer);
    showToast('Sessão encerrada. Modo Visualizador (consulta pública) ativo.', 'info');
    if (activeTab === 'usuarios' || activeTab === 'backup' || activeTab === 'config-supabase' || activeTab === 'auditoria') {
      setActiveTab('inicio');
    }
  };

  /* Sync Handler */
  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const remoteUsers = await fetchUsuariosFromSupabase();
      const syncedUsers: UserProfile[] = remoteUsers.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        secretaria_id: user.secretaria_id || undefined,
        ativo: user.ativo,
        ultimo_acesso: user.ultimo_acesso ? new Date(user.ultimo_acesso).toLocaleString('pt-BR') : 'Nunca acessou',
        observacoes: user.observacoes || undefined,
      }));

      setUsuarios(syncedUsers);
      const formatted = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      setLastSyncDate(formatted);
      logAudit('Sincronização de usuários', 'Supabase Auth + public.usuarios', 'SYNC', `${syncedUsers.length} usuários carregados`);
      showToast(`${syncedUsers.length} usuário(s) sincronizado(s) do Supabase.`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado durante a sincronização.';
      showToast(message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateUser = async (user: UserProfile) => {
    try {
      await updateUsuarioPerfil({
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        secretaria_id: user.secretaria_id || null,
        ativo: user.ativo,
        ultimo_acesso: user.ultimo_acesso || null,
        observacoes: user.observacoes || null,
      });
      setUsuarios(previous => previous.map(item => item.id === user.id ? user : item));
      showToast(`Usuário ${user.nome} atualizado.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Não foi possível atualizar o usuário.', 'error');
    }
  };

  /* Action Handlers */
  const handleOpenNewAction = (date?: string, secId?: string) => {
    if (isViewer) {
      promptLogin('Para cadastrar ações no calendário oficial, autentique-se como Administrador ou Editor.');
      return;
    }

    setEditingAction(null);
    setActionFormDefaultDate(date);
    setActionFormDefaultSecId(secId || (activeTab === 'calendario-secretaria' ? selectedSecretariaId : secretarias[0]?.id));
    setActionFormModalOpen(true);
  };

  const handleOpenEditAction = (action: MunicipalAction) => {
    if (!canEditSecretaria(action.secretaria_id)) {
      promptLogin('Permissão insuficiente para editar esta ação.');
      return;
    }

    setEditingAction(action);
    setActionFormDefaultDate(undefined);
    setActionFormDefaultSecId(undefined);
    setActionDetailModalOpen(false);
    setDayDetailsModalOpen(false);
    setActionFormModalOpen(true);
  };

  const handleSaveAction = (formData: Partial<MunicipalAction>, attachments: ActionAttachment[]) => {
    const sec = secretarias.find(s => s.id === formData.secretaria_id);
    const secNome = sec ? sec.nome : 'Secretaria Municipal';

    if (editingAction) {
      const historyItem: ActionHistory = {
        id: `h-${Date.now()}`,
        acao_id: editingAction.id,
        usuario_nome: currentUser.nome,
        tipo_alteracao: 'edição',
        descricao: `Ação atualizada por ${currentUser.nome} (${currentUser.perfil})`,
        created_at: new Date().toLocaleString('pt-BR')
      };

      setAcoes(prev => prev.map(a => {
        if (a.id === editingAction.id) {
          return {
            ...a,
            ...(formData as MunicipalAction),
            anexos: attachments,
            updated_at: new Date().toISOString(),
            atualizado_por: currentUser.id,
            historico: [historyItem, ...(a.historico || [])]
          };
        }
        return a;
      }));

      logAudit('Ação atualizada', formData.titulo!, 'UPDATE', secNome);
      showToast(`Ação "${formData.titulo}" atualizada com sucesso!`, 'success');
    } else {
      const newActionId = `act-${Date.now()}`;
      const historyItem: ActionHistory = {
        id: `h-${Date.now()}`,
        acao_id: newActionId,
        usuario_nome: currentUser.nome,
        tipo_alteracao: 'criação',
        descricao: `Ação criada na ${secNome} por ${currentUser.nome}`,
        created_at: new Date().toLocaleString('pt-BR')
      };

      const newAction: MunicipalAction = {
        id: newActionId,
        secretaria_id: formData.secretaria_id!,
        titulo: formData.titulo!.trim(),
        descricao: formData.descricao || '',
        data_inicio: formData.data_inicio!,
        data_fim: formData.data_fim || formData.data_inicio!,
        hora_inicio: formData.hora_inicio || '09:00',
        hora_fim: formData.hora_fim || '',
        local: formData.local!.trim(),
        responsavel: formData.responsavel!.trim(),
        tipo: formData.tipo || 'Evento',
        status: formData.status || 'Pendente',
        publico_alvo: formData.publico_alvo || '',
        observacoes: formData.observacoes || '',
        origem_recurso: formData.origem_recurso || 'Recursos Próprios',
        detalhe_origem: formData.detalhe_origem || '',
        anexos: attachments,
        historico: [historyItem],
        criado_por: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAcoes(prev => [newAction, ...prev]);
      logAudit('Nova ação cadastrada', newAction.titulo, 'INSERT', secNome);
      showToast(`Ação "${newAction.titulo}" inserida no calendário oficial!`, 'success');
    }

    setActionFormModalOpen(false);
  };

  const handleConfirmDeleteAction = () => {
    if (!actionToDelete) return;
    if (!isSuperAdmin) {
      showToast('Apenas o Administrador pode excluir ações permanentemente.', 'error');
      setDeleteConfirmModalOpen(false);
      return;
    }

    logAudit('Ação excluída', actionToDelete.titulo, 'DELETE');
    setAcoes(prev => prev.filter(a => a.id !== actionToDelete.id));
    setDeleteConfirmModalOpen(false);
    setActionDetailModalOpen(false);
    setDayDetailsModalOpen(false);
    setActionToDelete(null);
    showToast('Ação municipal removida com sucesso.', 'info');
  };

  /* Google Calendar Sync */
  const handleConfirmGoogleSync = () => {
    if (!actionForGoogle) return;

    const mockGoogleEventId = `gcal_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    setAcoes(prev => prev.map(a => {
      if (a.id === actionForGoogle.id) {
        return {
          ...a,
          google_event_id: mockGoogleEventId,
          updated_at: new Date().toISOString()
        };
      }
      return a;
    }));

    logAudit('Google Agenda sincronizado', actionForGoogle.titulo, 'SYNC', `Event ID: ${mockGoogleEventId}`);
    showToast(`Compromisso sincronizado com o Google Agenda!`, 'success');
    setGoogleSyncModalOpen(false);
    setActionForGoogle(null);
  };

  /* Secretariat Handlers */
  const handleSaveSecretaria = (secData: Secretariat) => {
    if (!isSuperAdmin) {
      showToast('Apenas Administradores têm permissão para alterar secretarias.', 'error');
      return;
    }

    if (editingSecretaria) {
      setSecretarias(prev => prev.map(s => s.id === secData.id ? { ...secData, updated_at: new Date().toISOString() } : s));
      logAudit('Secretaria atualizada', secData.nome, 'UPDATE');
      showToast(`Secretaria "${secData.nome}" atualizada!`, 'success');
    } else {
      setSecretarias(prev => [...prev, secData]);
      logAudit('Nova secretaria criada', secData.nome, 'INSERT');
      showToast(`Secretaria "${secData.nome}" cadastrada com sucesso!`, 'success');
    }

    setSecretariaModalOpen(false);
    setEditingSecretaria(null);
  };

  const handleToggleSecretariaStatus = (secId: string) => {
    if (!isSuperAdmin) return;
    setSecretarias(prev => prev.map(s => {
      if (s.id === secId) {
        const next = !s.ativo;
        logAudit('Status de secretaria alterado', s.nome, 'UPDATE', next ? 'Ativada' : 'Desativada');
        showToast(`Secretaria "${s.nome}" ${next ? 'ativada' : 'desativada'}.`, 'info');
        return { ...s, ativo: next, updated_at: new Date().toISOString() };
      }
      return s;
    }));
  };

  /* User Management Handlers */
  const handleAddUser = (user: UserProfile) => {
    setUsuarios(prev => [...prev, user]);
    logAudit('Usuário adicionado', user.nome, 'PERMISSION', `Perfil: ${user.perfil}`);
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = usuarios.find(item => item.id === userId);
    if (!user) return;
    const next = !user.ativo;

    try {
      await updateUsuarioStatus(userId, next);
      setUsuarios(prev => prev.map(item => item.id === userId ? { ...item, ativo: next } : item));
      logAudit('Status de usuário alterado', user.nome, 'PERMISSION', next ? 'Ativo' : 'Inativo');
      showToast(`Usuário ${user.nome} ${next ? 'ativado' : 'desativado'}.`, 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Não foi possível atualizar o status.', 'error');
    }
  };

  /* Restore Backup Handler */
  const handleRestoreBackup = (parsedData: any) => {
    setParsedBackupData(parsedData);
    setRestoreConfirmModalOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!parsedBackupData) return;

    let importados = 0;
    let atualizados = 0;

    try {
      // Upsert secretarias
      setSecretarias(prev => {
        const map = new Map(prev.map(s => [s.id, s]));
        parsedBackupData.secretarias?.forEach((sec: Secretariat) => {
          if (map.has(sec.id)) {
            atualizados++;
          } else {
            importados++;
          }
          map.set(sec.id, sec);
        });
        return Array.from(map.values());
      });

      // Upsert acoes
      setAcoes(prev => {
        const map = new Map(prev.map(a => [a.id, a]));
        parsedBackupData.acoes?.forEach((act: MunicipalAction) => {
          if (map.has(act.id)) {
            atualizados++;
          } else {
            importados++;
          }
          map.set(act.id, act);
        });
        return Array.from(map.values());
      });

      const total = (parsedBackupData.acoes?.length || 0) + (parsedBackupData.secretarias?.length || 0);
      logAudit('Backup restaurado', `Versão ${parsedBackupData.versao}`, 'BACKUP', `Total: ${total} registros`);
      showToast('Backup restaurado e sincronizado com sucesso via UPSERT!', 'success');
      setRestoreConfirmModalOpen(false);
      setParsedBackupData(null);
    } catch (err) {
      showToast('Erro durante a restauração do arquivo JSON.', 'error');
    }
  };

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'Em andamento':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'Concluído':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'Cancelado':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'Pendente':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const totalArquivosCount = acoes.reduce((acc, a) => acc + (a.anexos?.length || 0), 0);
  const distinctResponsaveisCount = new Set(acoes.map(a => a.responsavel?.trim()).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold ${
            toastMessage.type === 'error' ? 'bg-rose-600 text-white border-rose-700' :
            toastMessage.type === 'info' ? 'bg-blue-700 text-white border-blue-800' :
            'bg-slate-900 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Institutional Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        isSyncing={isSyncing}
        lastSyncDate={lastSyncDate}
        onSync={handleSync}
        currentUser={currentUser}
        onLoginClick={() => promptLogin('ACESSO RESTRITO - Informe credenciais para gerenciar e editar.')}
        onLogoutClick={handleLogout}
        onNewActionClick={() => handleOpenNewAction()}
        layoutConfig={layoutConfig}
        totalAcoes={acoes.length}
        totalSecretarias={secretarias.length}
        totalResponsaveis={distinctResponsaveisCount}
        totalArquivos={totalArquivosCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'inicio' && (
          <InicioTab
            layoutConfig={layoutConfig}
            secretarias={secretarias}
            acoes={acoes}
            isSuperAdmin={isSuperAdmin}
            onSelectSecretaria={(secId) => {
              setSelectedSecretariaId(secId);
              setActiveTab('calendario-secretaria');
            }}
            setActiveTab={setActiveTab}
            onNewSecretariaClick={() => {
              setEditingSecretaria(null);
              setSecretariaModalOpen(true);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            acoes={acoes}
            secretarias={secretarias}
            onSelectAction={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
            getStatusBadge={getStatusBadge}
          />
        )}

        {(activeTab === 'calendario-geral' || activeTab === 'calendario-secretaria') && (
          <CalendarTab
            isGeral={activeTab === 'calendario-geral'}
            selectedSecretariaId={selectedSecretariaId}
            secretarias={secretarias}
            acoes={acoes}
            isViewer={isViewer}
            onOpenNewAction={handleOpenNewAction}
            onOpenActionDetail={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
            onOpenDayDetails={(dateStr) => {
              setSelectedDateForModal(dateStr);
              setDayDetailsModalOpen(true);
            }}
            onPromptLogin={promptLogin}
            getStatusBadge={getStatusBadge}
          />
        )}

        {activeTab === 'acoes' && (
          <ActionsTab
            acoes={acoes}
            secretarias={secretarias}
            isViewer={isViewer}
            canEditSecretaria={canEditSecretaria}
            isSuperAdmin={isSuperAdmin}
            onNewActionClick={() => handleOpenNewAction()}
            onViewAction={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
            onEditAction={handleOpenEditAction}
            onDeleteAction={(action) => {
              setActionToDelete(action);
              setDeleteConfirmModalOpen(true);
            }}
            onPromptLogin={promptLogin}
            getStatusBadge={getStatusBadge}
          />
        )}

        {activeTab === 'secretarias' && (
          <SecretariatsTab
            secretarias={secretarias}
            acoes={acoes}
            isSuperAdmin={isSuperAdmin}
            onSelectSecretariaCalendar={(secId) => {
              setSelectedSecretariaId(secId);
              setActiveTab('calendario-secretaria');
            }}
            onEditSecretaria={(sec) => {
              setEditingSecretaria(sec);
              setSecretariaModalOpen(true);
            }}
            onNewSecretaria={() => {
              setEditingSecretaria(null);
              setSecretariaModalOpen(true);
            }}
            onToggleSecretariaStatus={handleToggleSecretariaStatus}
          />
        )}

        {activeTab === 'responsaveis' && (
          <ResponsaveisTab
            acoes={acoes}
            secretarias={secretarias}
            onSelectAction={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
          />
        )}

        {activeTab === 'arquivos' && (
          <ArquivosTab
            acoes={acoes}
            secretarias={secretarias}
            onSelectAction={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
          />
        )}

        {activeTab === 'pesquisa' && (
          <PesquisaTab
            acoes={acoes}
            secretarias={secretarias}
            onSelectAction={(action) => {
              setSelectedAction(action);
              setActionDetailModalOpen(true);
            }}
            getStatusBadge={getStatusBadge}
          />
        )}

        {activeTab === 'relatorios' && (
          <RelatoriosTab
            acoes={acoes}
            secretarias={secretarias}
            layoutConfig={layoutConfig}
            getStatusBadge={getStatusBadge}
            onToast={showToast}
            onLogAudit={logAudit}
          />
        )}

        {activeTab === 'backup' && isSuperAdmin && (
          <BackupTab
            acoes={acoes}
            secretarias={secretarias}
            usuarios={usuarios}
            onRestoreBackup={handleRestoreBackup}
            onToast={showToast}
            onLogAudit={logAudit}
          />
        )}

        {activeTab === 'usuarios' && isSuperAdmin && (
          <UsuariosTab
            usuarios={usuarios}
            secretarias={secretarias}
  onAddUser={handleAddUser}
  onUpdateUser={handleUpdateUser}
  onToggleUserStatus={handleToggleUserStatus}
            onToast={showToast}
          />
        )}

        {activeTab === 'auditoria' && isSuperAdmin && (
          <AuditoriaTab logs={auditLogs} />
        )}

        {activeTab === 'config-supabase' && isSuperAdmin && (
          <SupabaseConfigTab onToast={showToast} />
        )}
      </main>

      {/* MODALS */}
      <DayDetailsModal
        isOpen={dayDetailsModalOpen}
        dateStr={selectedDateForModal}
        acoes={acoes}
        secretarias={secretarias}
        isViewer={isViewer}
        onClose={() => setDayDetailsModalOpen(false)}
        onSelectAction={(action) => {
          setSelectedAction(action);
          setActionDetailModalOpen(true);
        }}
        onNewActionInDay={(dateStr) => handleOpenNewAction(dateStr)}
        getStatusBadge={getStatusBadge}
      />

      <ActionDetailModal
        isOpen={actionDetailModalOpen}
        action={selectedAction}
        secretarias={secretarias}
        canEdit={selectedAction ? canEditSecretaria(selectedAction.secretaria_id) : false}
        isSuperAdmin={isSuperAdmin}
        onClose={() => setActionDetailModalOpen(false)}
        onEdit={handleOpenEditAction}
        onDelete={(action) => {
          setActionToDelete(action);
          setDeleteConfirmModalOpen(true);
        }}
        onGoogleSync={(action) => {
          setActionForGoogle(action);
          setGoogleSyncModalOpen(true);
        }}
        getStatusBadge={getStatusBadge}
      />

      <ActionFormModal
        isOpen={actionFormModalOpen}
        editingAction={editingAction}
        secretarias={secretarias}
        defaultDate={actionFormDefaultDate}
        defaultSecretariaId={actionFormDefaultSecId}
        currentUserName={currentUser.nome}
        onClose={() => setActionFormModalOpen(false)}
        onSave={handleSaveAction}
        onToast={showToast}
      />

      <GoogleSyncModal
        isOpen={googleSyncModalOpen}
        action={actionForGoogle}
        onClose={() => setGoogleSyncModalOpen(false)}
        onConfirm={handleConfirmGoogleSync}
      />

      <LoginModal
        isOpen={loginModalOpen}
        intentMessage={loginIntentMessage}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        onQuickLogin={handleQuickLogin}
      />

      <SecretariaModal
        isOpen={secretariaModalOpen}
        editingSecretaria={editingSecretaria}
        onClose={() => setSecretariaModalOpen(false)}
        onSave={handleSaveSecretaria}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmModalOpen}
        action={actionToDelete}
        onClose={() => setDeleteConfirmModalOpen(false)}
        onConfirm={handleConfirmDeleteAction}
      />

      <RestoreConfirmModal
        isOpen={restoreConfirmModalOpen}
        parsedBackupData={parsedBackupData}
        onClose={() => {
          setRestoreConfirmModalOpen(false);
          setParsedBackupData(null);
        }}
        onConfirm={handleConfirmRestore}
      />

      {/* Institutional Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
              CA
            </div>
            <div>
              <span className="font-bold text-white text-sm">{layoutConfig.rodapeTitulo}</span>
              <p className="text-[11px] text-slate-400">{layoutConfig.rodapeDescricao}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] flex-wrap">
            <span>{layoutConfig.rodapeCopyright}</span>
            {isSuperAdmin && (
              <button 
                onClick={() => setActiveTab('config-supabase')}
                className="text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                Documentação SQL & RLS
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
