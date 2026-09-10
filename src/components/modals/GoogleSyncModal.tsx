import React from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { MunicipalAction } from '../../types';

interface GoogleSyncModalProps {
  isOpen: boolean;
  action: MunicipalAction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const GoogleSyncModal: React.FC<GoogleSyncModalProps> = ({
  isOpen,
  action,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Sincronizar com Google Agenda
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          O compromisso <strong>"{action.titulo}"</strong> será enviado à API do Google Calendar através de integração OAuth 2.0.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
          <div>Data: <strong>{action.data_inicio.split('-').reverse().join('/')}</strong></div>
          <div>Horário: <strong>{action.hora_inicio} às {action.hora_fim || '11:00'}</strong></div>
          <div>Local: <strong>{action.local}</strong></div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Sincronização</span>
          </button>
        </div>
      </div>
    </div>
  );
};
