import React from 'react';
import { 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  BarChart3, 
  FileText, 
  Plus, 
  Building2, 
  ArrowRight 
} from 'lucide-react';
import { Secretariat, MunicipalAction, HeaderFooterConfig, TabType } from '../types';

interface InicioTabProps {
  layoutConfig: HeaderFooterConfig;
  secretarias: Secretariat[];
  acoes: MunicipalAction[];
  isSuperAdmin: boolean;
  onSelectSecretaria: (secId: string) => void;
  setActiveTab: (tab: TabType) => void;
  onNewSecretariaClick: () => void;
}

export const InicioTab: React.FC<InicioTabProps> = ({
  layoutConfig,
  secretarias,
  acoes,
  isSuperAdmin,
  onSelectSecretaria,
  setActiveTab,
  onNewSecretariaClick
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Institutional Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Plataforma Oficial de Transparência
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {layoutConfig.portalTitulo}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {layoutConfig.portalSubtitulo}. Escolha uma Secretaria abaixo para acessar seu calendário individualizado ou acompanhe o calendário integrado de todo o município.
          </p>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('calendario-geral')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Ver Calendário Geral</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/80 hover:bg-blue-700 border border-blue-400/30 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Painel & Métricas</span>
            </button>
            <button
              onClick={() => setActiveTab('relatorios')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Emitir Relatórios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secretariats Grid with exact standard names */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Secretarias Municipais
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecione para consultar o cronograma e ações específicas de cada pasta
            </p>
          </div>
          {isSuperAdmin && (
            <button
              onClick={onNewSecretariaClick}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Secretaria</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {secretarias.filter(s => s.ativo).map(sec => {
            const upcomingCount = acoes.filter(a => a.secretaria_id === sec.id).length;
            return (
              <div
                key={sec.id}
                onClick={() => onSelectSecretaria(sec.id)}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm font-bold"
                      style={{ backgroundColor: sec.cor || '#2563eb' }}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sec.sigla}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {sec.nome}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {sec.descricao}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span><strong>{upcomingCount}</strong> ações</span>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    Abrir <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
