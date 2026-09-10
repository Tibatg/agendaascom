import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Edit3, 
  ArrowRight, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Secretariat, MunicipalAction } from '../types';

interface SecretariatsTabProps {
  secretarias: Secretariat[];
  acoes: MunicipalAction[];
  isSuperAdmin: boolean;
  onSelectSecretariaCalendar: (secId: string) => void;
  onEditSecretaria: (sec: Secretariat) => void;
  onNewSecretaria: () => void;
  onToggleSecretariaStatus: (secId: string) => void;
}

export const SecretariatsTab: React.FC<SecretariatsTabProps> = ({
  secretarias,
  acoes,
  isSuperAdmin,
  onSelectSecretariaCalendar,
  onEditSecretaria,
  onNewSecretaria,
  onToggleSecretariaStatus
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const filteredSecs = useMemo(() => {
    return secretarias.filter(s => {
      if (statusFilter === 'ativos' && !s.ativo) return false;
      if (statusFilter === 'inativos' && s.ativo) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNome = s.nome.toLowerCase().includes(q);
        const matchSigla = s.sigla.toLowerCase().includes(q);
        const matchDesc = s.descricao.toLowerCase().includes(q);
        if (!matchNome && !matchSigla && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => a.ordem - b.ordem);
  }, [secretarias, search, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Estrutura Administrativa
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Secretarias Municipais
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestão das pastas da administração pública, paleta de cores institucional e calendários específicos
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={onNewSecretaria}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Secretaria</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar secretaria por nome, sigla ou atribuições..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="todos">Todas as Secretarias</option>
            <option value="ativos">Somente Ativas</option>
            <option value="inativos">Somente Inativas</option>
          </select>
        </div>
      </div>

      {/* Grid of Secretarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSecs.map(sec => {
          const actionCount = acoes.filter(a => a.secretaria_id === sec.id).length;
          return (
            <div
              key={sec.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm font-bold shrink-0"
                      style={{ backgroundColor: sec.cor || '#2563eb' }}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {sec.sigla}
                        </span>
                        {sec.ativo ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <XCircle className="w-3 h-3" /> Inativa
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                        {sec.nome}
                      </h3>
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <button
                      onClick={() => onEditSecretaria(sec)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 cursor-pointer"
                      title="Editar dados da secretaria"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {sec.descricao}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span><strong>{actionCount}</strong> ações cadastradas</span>
                </span>

                <div className="flex items-center gap-2">
                  {isSuperAdmin && (
                    <button
                      onClick={() => onToggleSecretariaStatus(sec.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {sec.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  )}
                  <button
                    onClick={() => onSelectSecretariaCalendar(sec.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>Ver Calendário</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
