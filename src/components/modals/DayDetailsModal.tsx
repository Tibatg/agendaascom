import React from 'react';
import { X, Plus } from 'lucide-react';
import { MunicipalAction, Secretariat, ActionStatus } from '../../types';

interface DayDetailsModalProps {
  isOpen: boolean;
  dateStr: string | null;
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  isViewer: boolean;
  onClose: () => void;
  onSelectAction: (action: MunicipalAction) => void;
  onNewActionInDay: (dateStr: string) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  isOpen,
  dateStr,
  acoes,
  secretarias,
  isViewer,
  onClose,
  onSelectAction,
  onNewActionInDay,
  getStatusBadge
}) => {
  if (!isOpen || !dateStr) return null;

  const dayActions = acoes.filter(a => a.data_inicio === dateStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Ações do Dia</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {dateStr.split('-').reverse().join('/')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          {dayActions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-semibold">
              Nenhuma ação agendada para esta data.
            </div>
          ) : (
            dayActions.map(act => {
              const sec = secretarias.find(s => s.id === act.secretaria_id);
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    onClose();
                    onSelectAction(act);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-500 cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{act.titulo}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {act.hora_inicio} • {sec?.sigla} • {act.local}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(act.status)}`}>
                    {act.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
          {!isViewer && (
            <button
              onClick={() => {
                onClose();
                onNewActionInDay(dateStr);
              }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Ação Neste Dia</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
