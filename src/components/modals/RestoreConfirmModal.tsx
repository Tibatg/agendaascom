import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  parsedBackupData: any | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  isOpen,
  parsedBackupData,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !parsedBackupData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Confirmar Restauração de Backup?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Os registros encontrados serão atualizados ou inseridos via UPSERT sem perda da integridade das secretarias.
          </p>
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-left space-y-1 border border-slate-200 dark:border-slate-700">
            <div>Sistema: <strong>{parsedBackupData.sistema}</strong> (v{parsedBackupData.versao})</div>
            <div>Ações no arquivo: <strong>{parsedBackupData.acoes?.length || 0}</strong></div>
            <div>Secretarias no arquivo: <strong>{parsedBackupData.secretarias?.length || 0}</strong></div>
            {parsedBackupData.exportado_em && (
              <div className="text-slate-400 text-[11px]">Gerado em: {parsedBackupData.exportado_em}</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer"
          >
            Confirmar Restauração
          </button>
        </div>
      </div>
    </div>
  );
};
