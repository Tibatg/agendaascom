import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Coins, 
  ChevronDown, 
  CalendarDays, 
  Lock 
} from 'lucide-react';
import { 
  Secretariat, 
  MunicipalAction, 
  CalendarViewMode, 
  TipoEmenda, 
  TipoParceria,
  ActionStatus 
} from '../types';
import { MONTH_NAMES, WEEK_DAYS } from '../data/initialData';

interface CalendarTabProps {
  isGeral: boolean;
  selectedSecretariaId: string;
  secretarias: Secretariat[];
  acoes: MunicipalAction[];
  isViewer: boolean;
  onOpenNewAction: (date?: string, secId?: string) => void;
  onOpenActionDetail: (action: MunicipalAction) => void;
  onOpenDayDetails: (dateStr: string) => void;
  onPromptLogin: (msg: string) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  isGeral,
  selectedSecretariaId,
  secretarias,
  acoes,
  isViewer,
  onOpenNewAction,
  onOpenActionDetail,
  onOpenDayDetails,
  onPromptLogin,
  getStatusBadge
}) => {
  const [calendarView, setCalendarView] = useState<CalendarViewMode>('mensal');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 10)); // Sept 10, 2026
  const [selectedCalendarTag, setSelectedCalendarTag] = useState<string>('todos');
  const [tagDropdownOpen, setTagDropdownOpen] = useState<boolean>(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSecretaria = useMemo(() => {
    return secretarias.find(s => s.id === selectedSecretariaId);
  }, [secretarias, selectedSecretariaId]);

  const filteredActions = useMemo(() => {
    return acoes.filter(a => {
      if (!isGeral && a.secretaria_id !== selectedSecretariaId) {
        return false;
      }
      if (selectedCalendarTag !== 'todos') {
        if (selectedCalendarTag.startsWith('emenda-')) {
          const emendaTipo = selectedCalendarTag.replace('emenda-', '');
          if (a.origem_recurso !== 'Emenda' || a.detalhe_origem !== emendaTipo) return false;
        } else if (selectedCalendarTag.startsWith('parceria-')) {
          const parceriaTipo = selectedCalendarTag.replace('parceria-', '');
          if (a.origem_recurso !== 'Parceria' || a.detalhe_origem !== parceriaTipo) return false;
        } else if (selectedCalendarTag === 'proprios') {
          if (a.origem_recurso !== 'Recursos Próprios') return false;
        }
      }
      return true;
    });
  }, [acoes, isGeral, selectedSecretariaId, selectedCalendarTag]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const totalDays = lastDay.getDate();
    const daysArray: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      actions: MunicipalAction[];
    }[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevD = new Date(year, month - 1, dayNum);
      const y = prevD.getFullYear();
      const m = String(prevD.getMonth() + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      daysArray.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: false,
        actions: []
      });
    }

    for (let d = 1; d <= totalDays; d++) {
      const curD = new Date(year, month, d);
      const y = curD.getFullYear();
      const m = String(curD.getMonth() + 1).padStart(2, '0');
      const dayFormatted = String(d).padStart(2, '0');
      const dStr = `${y}-${m}-${dayFormatted}`;

      const dayActions = filteredActions.filter(a => a.data_inicio === dStr);

      daysArray.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dStr === '2026-09-10',
        actions: dayActions
      });
    }

    const remaining = (7 - (daysArray.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextD = new Date(year, month + 1, i);
      const y = nextD.getFullYear();
      const m = String(nextD.getMonth() + 1).padStart(2, '0');
      const d = String(i).padStart(2, '0');
      daysArray.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        actions: []
      });
    }

    return daysArray;
  }, [currentDate, filteredActions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Calendar Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {isGeral ? 'Visualização Integrada' : 'Calendário Exclusivo'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase mt-1">
            {isGeral ? 'CALENDÁRIO GERAL DE AÇÕES' : activeSecretaria?.nome}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acompanhamento oficial das demandas, eventos e compromissos municipais
          </p>
        </div>

        {/* View Modes and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setCalendarView('mensal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                calendarView === 'mensal' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setCalendarView('semanal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                calendarView === 'semanal' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setCalendarView('diaria')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                calendarView === 'diaria' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Diária
            </button>
            <button
              onClick={() => setCalendarView('lista')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                calendarView === 'lista' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Lista
            </button>
          </div>

          {!isViewer ? (
            <button
              onClick={() => onOpenNewAction(undefined, !isGeral ? selectedSecretariaId : undefined)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Ação</span>
            </button>
          ) : (
            <button
              onClick={() => onPromptLogin('Faça login como Administrador ou Editor para cadastrar ações.')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Entrar para cadastrar</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Navigation and Funding Tags */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 8, 10))}
            className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Hoje
          </button>

          <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">
            {MONTH_NAMES[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </span>
        </div>

        {/* Tag button filter */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="relative" ref={tagDropdownRef}>
            <button
              onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Marcações de Recursos: <strong>{selectedCalendarTag === 'todos' ? 'Todas' : selectedCalendarTag}</strong></span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {tagDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-2 text-xs">
                <button
                  onClick={() => { setSelectedCalendarTag('todos'); setTagDropdownOpen(false); }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer ${selectedCalendarTag === 'todos' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Todas as Ações
                </button>
                <div className="pt-2 border-t mt-1 text-[10px] font-bold text-amber-600 uppercase">Emendas Parlamentares:</div>
                {(['Vereador', 'Deputado Estadual', 'Deputado Federal', 'Senador'] as TipoEmenda[]).map(e => (
                  <button
                    key={e}
                    onClick={() => { setSelectedCalendarTag(`emenda-${e}`); setTagDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer ${selectedCalendarTag === `emenda-${e}` ? 'font-bold text-blue-600' : ''}`}
                  >
                    Emenda: {e}
                  </button>
                ))}
                <div className="pt-2 border-t mt-1 text-[10px] font-bold text-emerald-600 uppercase">Parcerias Institucionais:</div>
                {(['Governo do Estado', 'Governo Federal'] as TipoParceria[]).map(p => (
                  <button
                    key={p}
                    onClick={() => { setSelectedCalendarTag(`parceria-${p}`); setTagDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer ${selectedCalendarTag === `parceria-${p}` ? 'font-bold text-blue-600' : ''}`}
                  >
                    Parceria: {p}
                  </button>
                ))}
                <div className="pt-2 border-t mt-1">
                  <button
                    onClick={() => { setSelectedCalendarTag('proprios'); setTagDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer ${selectedCalendarTag === 'proprios' ? 'font-bold text-blue-600' : ''}`}
                  >
                    Recursos Próprios
                  </button>
                </div>
              </div>
            )}
          </div>

          <select
            value={currentDate.getMonth()}
            onChange={(e) => setCurrentDate(prev => new Date(prev.getFullYear(), parseInt(e.target.value, 10), 1))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select
            value={currentDate.getFullYear()}
            onChange={(e) => setCurrentDate(prev => new Date(parseInt(e.target.value, 10), prev.getMonth(), 1))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {[2025, 2026, 2027, 2028].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RENDER VIEW: MENSAL */}
      {calendarView === 'mensal' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center text-[11px] font-bold text-slate-600 dark:text-slate-300 py-2.5">
            {WEEK_DAYS.map(day => (
              <div key={day} className="uppercase tracking-wider">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    onOpenDayDetails(cell.dateStr);
                  }
                }}
                className={`min-h-[115px] p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700'
                    : cell.isToday
                    ? 'bg-blue-50/40 dark:bg-blue-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    cell.isToday ? 'bg-blue-700 text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {cell.dayNumber}
                  </span>
                  {cell.actions.length > 0 && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {cell.actions.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-auto overflow-hidden">
                  {cell.actions.slice(0, 2).map(act => {
                    const sec = secretarias.find(s => s.id === act.secretaria_id);
                    return (
                      <div
                        key={act.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenActionDetail(act);
                        }}
                        className="text-[11px] p-1 rounded font-medium border truncate hover:scale-[1.01] transition-transform cursor-pointer"
                        style={{
                          backgroundColor: sec ? `${sec.cor}18` : '#2563eb18',
                          borderColor: sec ? `${sec.cor}50` : '#2563eb50',
                          color: sec?.cor || '#2563eb'
                        }}
                        title={act.titulo}
                      >
                        <div className="font-bold truncate">{act.titulo}</div>
                        <div className="text-[10px] opacity-80">{act.hora_inicio}</div>
                      </div>
                    );
                  })}
                  {cell.actions.length > 2 && (
                    <span className="text-[10px] font-bold text-blue-600 block pl-1">
                      + {cell.actions.length - 2} ações
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER VIEW: LISTA */}
      {calendarView === 'lista' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Horário</th>
                <th className="p-3">Ação</th>
                <th className="p-3">Secretaria</th>
                <th className="p-3">Local</th>
                <th className="p-3">Responsável</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma ação encontrada para este calendário ou filtro.
                  </td>
                </tr>
              ) : (
                filteredActions.map(action => {
                  const sec = secretarias.find(s => s.id === action.secretaria_id);
                  return (
                    <tr key={action.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold whitespace-nowrap">{action.data_inicio.split('-').reverse().join('/')}</td>
                      <td className="p-3 whitespace-nowrap">{action.hora_inicio}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{action.titulo}</td>
                      <td className="p-3 whitespace-nowrap">{sec?.sigla}</td>
                      <td className="p-3 text-slate-500">{action.local}</td>
                      <td className="p-3">{action.responsavel}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(action.status)}`}>
                          {action.status}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenActionDetail(action)}
                          className="text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* RENDER VIEW: DIÁRIA / SEMANAL */}
      {(calendarView === 'diaria' || calendarView === 'semanal') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-blue-600 mx-auto opacity-70" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200">
            Visualização {calendarView === 'diaria' ? 'Diária' : 'Semanal'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {filteredActions.length} ações municipais catalogadas no período ativo.
          </p>
          <div className="space-y-2 max-w-2xl mx-auto text-left pt-2">
            {filteredActions.slice(0, 5).map(act => (
              <div 
                key={act.id}
                onClick={() => onOpenActionDetail(act)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{act.titulo}</div>
                  <div className="text-[11px] text-slate-500">{act.data_inicio.split('-').reverse().join('/')} às {act.hora_inicio} • {act.local}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(act.status)}`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <button
              onClick={() => setCalendarView('mensal')}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Retornar à Grade Mensal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
