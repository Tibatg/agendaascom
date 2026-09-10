import React, { useState } from 'react';
import { History, Shield, Filter, Clock } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditoriaTabProps {
  logs: AuditLog[];
}

export const AuditoriaTab: React.FC<AuditoriaTabProps> = ({ logs }) => {
  const [filterOp, setFilterOp] = useState<string>('todos');

  const filteredLogs = logs.filter(l => {
    if (filterOp !== 'todos' && l.tipo_operacao !== filterOp) return false;
    return true;
  });

  const getOpBadge = (op: string) => {
    switch (op) {
      case 'INSERT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
      case 'AUTH':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
      case 'BACKUP':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
      case 'SYNC':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Rastreabilidade e Compliance
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Trilha de Auditoria do Sistema
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro cronológico de todas as inclusões, alterações, exclusões, autenticações e exportações
          </p>
        </div>

        <div>
          <select
            value={filterOp}
            onChange={(e) => setFilterOp(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="todos">Todas as Operações</option>
            <option value="INSERT">Inclusões (INSERT)</option>
            <option value="UPDATE">Atualizações (UPDATE)</option>
            <option value="DELETE">Exclusões (DELETE)</option>
            <option value="AUTH">Autenticação (AUTH)</option>
            <option value="BACKUP">Backups / Exportações</option>
            <option value="SYNC">Sincronizações</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-4">Data & Horário</th>
              <th className="p-4">Operação</th>
              <th className="p-4">Ação Realizada</th>
              <th className="p-4">Registro / Entidade</th>
              <th className="p-4">Usuário</th>
              <th className="p-4">Perfil</th>
              <th className="p-4">Detalhes Relevantes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Nenhum evento registrado no log de auditoria até o momento.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {log.created_at}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getOpBadge(log.tipo_operacao)}`}>
                      {log.tipo_operacao}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{log.acao_realizada}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{log.registro_alterado}</td>
                  <td className="p-4 font-medium">{log.usuario_nome}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[10px] font-semibold text-slate-500">{log.perfil}</span>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">{log.dados_relevantes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
