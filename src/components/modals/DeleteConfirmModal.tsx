import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MunicipalAction } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  action: MunicipalAction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  action,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Excluir esta ação municipal?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Esta operação não poderá ser desfeita. O evento será removido permanentemente.
          </p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            "{action.titulo}"
          </p>
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
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
          >
            Excluir Ação
          </button>
        </div>
      </div>
    </div>
  );
};
