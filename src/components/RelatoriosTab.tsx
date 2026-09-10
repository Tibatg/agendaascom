import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  HardDrive, 
  Printer, 
  FileText, 
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';
import { Secretariat, MunicipalAction, ActionStatus } from '../types';
import { ACTION_STATUSES } from '../data/initialData';

interface RelatoriosTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  getStatusBadge: (status: ActionStatus) => string;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  onLogAudit: (acao: string, registro: string, tipo: any, detalhes?: string) => void;
}

export const RelatoriosTab: React.FC<RelatoriosTabProps> = ({
  acoes,
  secretarias,
  getStatusBadge,
  onToast,
  onLogAudit
}) => {
  const [reportSecretariaId, setReportSecretariaId] = useState('todas');
  const [reportType, setReportType] = useState<'simplificado' | 'detalhado'>('simplificado');
  const [reportStatus, setReportStatus] = useState('todos');
  const [reportResponsavel, setReportResponsavel] = useState('todos');
  const [reportDateStart, setReportDateStart] = useState('');
  const [reportDateEnd, setReportDateEnd] = useState('');

  const responsaveisList = useMemo(() => {
    const set = new Set<string>();
    acoes.forEach(a => {
      if (a.responsavel) set.add(a.responsavel.trim());
    });
    return Array.from(set).sort();
  }, [acoes]);

  const reportActions = useMemo(() => {
    return acoes.filter(action => {
      if (reportSecretariaId !== 'todas' && action.secretaria_id !== reportSecretariaId) return false;
      if (reportStatus !== 'todos' && action.status !== reportStatus) return false;
      if (reportResponsavel !== 'todos' && action.responsavel !== reportResponsavel) return false;
      if (reportDateStart && action.data_inicio < reportDateStart) return false;
      if (reportDateEnd && action.data_inicio > reportDateEnd) return false;
      return true;
    }).sort((a, b) => a.data_inicio.localeCompare(b.data_inicio));
  }, [acoes, reportSecretariaId, reportStatus, reportResponsavel, reportDateStart, reportDateEnd]);

  const handleExportCSV = () => {
    if (reportActions.length === 0) {
      onToast('Nenhuma ação encontrada para exportação.', 'error');
      return;
    }

    const headers = reportType === 'simplificado'
      ? ['Data', 'Horário Início', 'Horário Fim', 'Ação / Demanda', 'Secretaria', 'Local', 'Origem do Recurso', 'Status']
      : ['Data', 'Horário Início', 'Horário Fim', 'Ação / Demanda', 'Secretaria', 'Local', 'Responsável', 'Público-alvo', 'Origem do Recurso', 'Detalhe Origem', 'Google Event ID', 'Status', 'Descrição'];

    const rows = reportActions.map(action => {
      const sec = secretarias.find(s => s.id === action.secretaria_id);
      const clean = (val?: string) => `"${(val || '').replace(/"/g, '""')}"`;

      if (reportType === 'simplificado') {
        return [
          action.data_inicio.split('-').reverse().join('/'),
          action.hora_inicio || '',
          action.hora_fim || '',
          clean(action.titulo),
          clean(sec?.nome || 'Secretaria'),
          clean(action.local),
          clean(`${action.origem_recurso || 'Recursos Próprios'} ${action.detalhe_origem ? `(${action.detalhe_origem})` : ''}`),
          action.status
        ].join(';');
      } else {
        return [
          action.data_inicio.split('-').reverse().join('/'),
          action.hora_inicio || '',
          action.hora_fim || '',
          clean(action.titulo),
          clean(sec?.nome || 'Secretaria'),
          clean(action.local),
          clean(action.responsavel),
          clean(action.publico_alvo || ''),
          clean(action.origem_recurso || 'Recursos Próprios'),
          clean(action.detalhe_origem || ''),
          clean(action.google_event_id || 'Não sincronizado'),
          action.status,
          clean(action.descricao)
        ].join(';');
      }
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-demandas-${reportType}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    onLogAudit('Relatório CSV exportado', `Tipo: ${reportType}`, 'BACKUP', `${reportActions.length} registros`);
    onToast('Relatório em formato CSV baixado com sucesso!', 'success');
  };

  const handleExportJSON = () => {
    if (reportActions.length === 0) {
      onToast('Nenhuma ação encontrada para exportação.', 'error');
      return;
    }

    const reportData = {
      titulo: `Relatório Oficial de Demandas - ${reportType.toUpperCase()}`,
      gerado_em: new Date().toISOString(),
      filtros: {
        secretaria: reportSecretariaId,
        status: reportStatus,
        responsavel: reportResponsavel,
        periodo: `${reportDateStart || 'Início'} até ${reportDateEnd || 'Fim'}`
      },
      total_registros: reportActions.length,
      dados: reportActions
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.href = dataStr;
    dlAnchor.download = `relatorio-demandas-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    onLogAudit('Relatório JSON exportado', `Registros: ${reportActions.length}`, 'BACKUP');
    onToast('Relatório em JSON exportado com sucesso!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Transparência e Prestação de Contas
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Relatório de Demandas e Ações
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gere relatórios consolidados com opções simplificada, detalhada, por secretaria e responsável
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Baixar CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
            <span>Baixar JSON</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Parameters Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="font-bold block mb-1">Secretaria Municipal</label>
            <select
              value={reportSecretariaId}
              onChange={(e) => setReportSecretariaId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todas">🏛️ Todas as Secretarias</option>
              {secretarias.map(s => (
                <option key={s.id} value={s.id}>{s.sigla} - {s.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Tipo de Relatório</label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setReportType('simplificado')}
                className={`py-1.5 rounded-md font-bold text-center cursor-pointer ${reportType === 'simplificado' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}
              >
                Simplificado
              </button>
              <button
                type="button"
                onClick={() => setReportType('detalhado')}
                className={`py-1.5 rounded-md font-bold text-center cursor-pointer ${reportType === 'detalhado' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}
              >
                Detalhado
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Status</label>
            <select
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todos">Todos os Status</option>
              {ACTION_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Responsável</label>
            <select
              value={reportResponsavel}
              onChange={(e) => setReportResponsavel(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="todos">Todos os Responsáveis</option>
              {responsaveisList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Data Inicial</label>
            <input
              type="date"
              value={reportDateStart}
              onChange={(e) => setReportDateStart(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Data & Horário</th>
                <th className="p-3.5">Ação / Demanda</th>
                <th className="p-3.5">Secretaria</th>
                <th className="p-3.5">Local</th>
                <th className="p-3.5">Responsável</th>
                {reportType === 'detalhado' && <th className="p-3.5">Origem Recurso</th>}
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reportActions.length === 0 ? (
                <tr>
                  <td colSpan={reportType === 'detalhado' ? 7 : 6} className="p-8 text-center text-slate-400">
                    Nenhuma demanda encontrada para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                reportActions.map(act => {
                  const sec = secretarias.find(s => s.id === act.secretaria_id);
                  return (
                    <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 whitespace-nowrap font-semibold">
                        <div>{act.data_inicio.split('-').reverse().join('/')}</div>
                        <div className="text-[11px] text-slate-400">{act.hora_inicio}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{act.titulo}</div>
                        {reportType === 'detalhado' && (
                          <div className="text-[11px] text-slate-500 line-clamp-1">{act.descricao}</div>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">{sec?.sigla}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{act.local}</td>
                      <td className="p-3.5">{act.responsavel}</td>
                      {reportType === 'detalhado' && (
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {act.origem_recurso}
                          </span>
                        </td>
                      )}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(act.status)}`}>
                          {act.status}
                        </span>
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
