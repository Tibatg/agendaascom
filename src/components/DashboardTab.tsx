import React, { useMemo } from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { Secretariat, MunicipalAction, ActionStatus } from '../types';
import { ACTION_STATUSES } from '../data/initialData';

interface DashboardTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  onSelectAction: (action: MunicipalAction) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  acoes,
  secretarias,
  onSelectAction,
  getStatusBadge
}) => {
  const metrics = useMemo(() => {
    const todayStr = '2026-09-10';
    const totalAcoes = acoes.length;
    const acoesHoje = acoes.filter(a => a.data_inicio === todayStr).length;

    // Week metrics (approx: 2026-09-07 to 2026-09-13)
    const acoesSemana = acoes.filter(a => a.data_inicio >= '2026-09-07' && a.data_inicio <= '2026-09-13').length;
    // Month metrics (September 2026)
    const acoesMes = acoes.filter(a => a.data_inicio.startsWith('2026-09')).length;

    const pendentes = acoes.filter(a => a.status === 'Pendente').length;
    const concluidas = acoes.filter(a => a.status === 'Concluído').length;
    const canceladas = acoes.filter(a => a.status === 'Cancelado').length;
    const agendadas = acoes.filter(a => a.status === 'Agendado').length;
    const emAndamento = acoes.filter(a => a.status === 'Em andamento').length;

    // By secretariat
    const porSecretaria = secretarias.map(sec => ({
      sigla: sec.sigla,
      nome: sec.nome,
      cor: sec.cor,
      total: acoes.filter(a => a.secretaria_id === sec.id).length
    }));

    return {
      totalAcoes,
      acoesHoje,
      acoesSemana,
      acoesMes,
      pendentes,
      concluidas,
      canceladas,
      agendadas,
      emAndamento,
      porSecretaria
    };
  }, [acoes, secretarias]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Painel Analítico de Governança
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
          Dashboard Geral de Demandas
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Métricas em tempo real, status operacional e distribuição de ações por pasta municipal
        </p>
      </div>

      {/* Metrics Top Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Total de Ações</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{metrics.totalAcoes}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Ações Hoje</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{metrics.acoesHoje}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Na Semana</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{metrics.acoesSemana}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">No Mês</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">{metrics.acoesMes}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Pendentes</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">{metrics.pendentes}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Concluídas</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{metrics.concluidas}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">Canceladas</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{metrics.canceladas}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Actions by Secretariat Visual Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Distribuição de Ações por Secretaria Municipal
            </h3>
            <span className="text-[11px] text-slate-400">{secretarias.length} pastas</span>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.porSecretaria.map((sec, idx) => {
              const pct = metrics.totalAcoes > 0 
                ? Math.round((sec.total / metrics.totalAcoes) * 100) 
                : 0;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.cor }}></span>
                      <span>{sec.sigla} - {sec.nome}</span>
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {sec.total} ações ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: sec.cor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-amber-500" />
              Distribuição por Status
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {ACTION_STATUSES.map(st => {
              const count = acoes.filter(a => a.status === st).length;
              const pct = metrics.totalAcoes > 0 ? Math.round((count / metrics.totalAcoes) * 100) : 0;
              return (
                <div key={st} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(st)}`}>
                    {st}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Actions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
          Próximas Ações no Cronograma
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Horário</th>
                <th className="p-3">Ação</th>
                <th className="p-3">Secretaria</th>
                <th className="p-3">Local</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {acoes.slice(0, 6).map(a => {
                const sec = secretarias.find(s => s.id === a.secretaria_id);
                return (
                  <tr 
                    key={a.id} 
                    onClick={() => onSelectAction(a)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <td className="p-3 font-semibold whitespace-nowrap">{a.data_inicio.split('-').reverse().join('/')}</td>
                    <td className="p-3 whitespace-nowrap">{a.hora_inicio}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{a.titulo}</td>
                    <td className="p-3">{sec?.sigla}</td>
                    <td className="p-3 text-slate-500">{a.local}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
