import React from 'react';
import { X, Building2 } from 'lucide-react';
import { Secretariat } from '../../types';

interface SecretariaModalProps {
  isOpen: boolean;
  editingSecretaria: Secretariat | null;
  onClose: () => void;
  onSave: (sec: Secretariat) => void;
}

export const SecretariaModal: React.FC<SecretariaModalProps> = ({
  isOpen,
  editingSecretaria,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = e.currentTarget as any;

    const newSec: Secretariat = {
      id: editingSecretaria?.id || `sec-${Date.now()}`,
      nome: t.nome.value.trim(),
      sigla: t.sigla.value.trim().toUpperCase(),
      descricao: t.descricao.value.trim(),
      icone: 'Building2',
      cor: t.cor.value,
      ativo: t.ativo.checked,
      ordem: parseInt(t.ordem.value, 10) || 1,
      created_at: editingSecretaria?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSave(newSec);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">
            {editingSecretaria ? 'Editar Secretaria' : 'Nova Secretaria Municipal'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Nome Oficial da Secretaria *</label>
            <input
              name="nome"
              required
              defaultValue={editingSecretaria?.nome || ''}
              placeholder="Ex: Secretaria Municipal de Meio Ambiente"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Sigla *</label>
              <input
                name="sigla"
                required
                defaultValue={editingSecretaria?.sigla || ''}
                placeholder="SEMMA"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold uppercase"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Cor Institucional</label>
              <input
                type="color"
                name="cor"
                defaultValue={editingSecretaria?.cor || '#2563eb'}
                className="w-full h-9 p-1 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Descrição e Competências</label>
            <textarea
              name="descricao"
              rows={2}
              defaultValue={editingSecretaria?.descricao || ''}
              placeholder="Atribuições principais da secretaria..."
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center pt-2">
            <div>
              <label className="font-bold block mb-1">Ordem de Exibição</label>
              <input
                type="number"
                name="ordem"
                defaultValue={editingSecretaria?.ordem || 1}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="secAtivo"
                name="ativo"
                defaultChecked={editingSecretaria ? editingSecretaria.ativo : true}
                className="rounded text-blue-600 cursor-pointer"
              />
              <label htmlFor="secAtivo" className="font-bold cursor-pointer">Secretaria Ativa</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold cursor-pointer shadow-xs"
            >
              Salvar Secretaria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
