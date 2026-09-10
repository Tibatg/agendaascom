import React, { useState, useMemo } from 'react';
import { Plus, Lock, Eye, Edit3, Trash2, Search, Filter } from 'lucide-react';
import { Secretariat, MunicipalAction, ActionStatus, ActionType } from '../types';

interface ActionsTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  isViewer: boolean;
  canEditSecretaria: (secId: string) => boolean;
  isSuperAdmin: boolean;
  onNewActionClick: () => void;
  onViewAction: (action: MunicipalAction) => void;
  onEditAction: (action: MunicipalAction) => void;
  onDeleteAction: (action: MunicipalAction) => void;
  onPromptLogin: (msg: string) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const ActionsTab: React.FC<ActionsTabProps> = ({
  acoes,
  secretarias,
  isViewer,
  canEditSecretaria,
  isSuperAdmin,
  onNewActionClick,
  onViewAction,
  onEditAction,
  onDeleteAction,
  onPromptLogin,
  getStatusBadge
}) => {
  const [search, setSearch] = useState('');
  const [secFilter, setSecFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filteredAcoes = useMemo(() => {
    return acoes.filter(a => {
      if (secFilter !== 'todas' && a.secretaria_id !== secFilter) return false;
      if (statusFilter !== 'todos' && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = a.titulo.toLowerCase().includes(q);
        const matchLocal = a.local.toLowerCase().includes(q);
        const matchResp = a.responsavel.toLowerCase().includes(q);
        const matchDesc = a.descricao.toLowerCase().includes(q);
        if (!matchTitle && !matchLocal && !matchResp && !matchDesc) return false;
      }
      return true;
    });
  }, [acoes, secFilter, statusFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Ações e Atividades das Secretarias
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visão consolidada de todas as iniciativas municipais cadastradas no sistema
          </p>
        </div>

        {!isViewer ? (
          <button
            onClick={onNewActionClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Ação</span>
          </button>
        ) : (
          <button
            onClick={() => onPromptLogin('Efetue login para cadastrar ações.')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 shadow-xs self-start cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Entrar para Cadastrar</span>
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, local ou responsável..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <select
            value={secFilter}
            onChange={(e) => setSecFilter(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="todas">Todas as Secretarias</option>
            {secretarias.map(s => (
              <option key={s.id} value={s.id}>{s.sigla} - {s.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="todos">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Agendado">Agendado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Actions Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Data & Horário</th>
                <th className="p-4">Ação Municipal</th>
                <th className="p-4">Secretaria Responsável</th>
                <th className="p-4">Local</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAcoes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma ação encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredAcoes.map(action => {
                  const sec = secretarias.find(s => s.id === action.secretaria_id);
                  return (
                    <tr key={action.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 whitespace-nowrap font-semibold">
                        <div>{action.data_inicio.split('-').reverse().join('/')}</div>
                        <div className="text-[11px] text-slate-400">{action.hora_inicio}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{action.titulo}</div>
                        <div className="text-slate-400 text-[11px] line-clamp-1">{action.descricao}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span 
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: sec ? `${sec.cor}20` : '#e2e8f0',
                            color: sec?.cor || '#1e293b'
                          }}
                        >
                          {sec ? sec.sigla : 'SEC'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{action.local}</td>
                      <td className="p-4">{action.responsavel}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {action.origem_recurso}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(action.status)}`}>
                          {action.status}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onViewAction(action)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEditSecretaria(action.secretaria_id) && (
                          <button
                            onClick={() => onEditAction(action)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {isSuperAdmin && (
                          <button
                            onClick={() => onDeleteAction(action)}
                            className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
