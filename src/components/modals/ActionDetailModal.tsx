import React from 'react';
import { X, Calendar as CalendarIcon, FileText, Download, Edit3, Trash2 } from 'lucide-react';
import { MunicipalAction, Secretariat, ActionStatus } from '../../types';

interface ActionDetailModalProps {
  isOpen: boolean;
  action: MunicipalAction | null;
  secretarias: Secretariat[];
  canEdit: boolean;
  isSuperAdmin: boolean;
  onClose: () => void;
  onEdit: (action: MunicipalAction) => void;
  onDelete: (action: MunicipalAction) => void;
  onGoogleSync: (action: MunicipalAction) => void;
  getStatusBadge: (status: ActionStatus) => string;
}

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({
  isOpen,
  action,
  secretarias,
  canEdit,
  isSuperAdmin,
  onClose,
  onEdit,
  onDelete,
  onGoogleSync,
  getStatusBadge
}) => {
  if (!isOpen || !action) return null;

  const sec = secretarias.find(s => s.id === action.secretaria_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
              {action.tipo} • {action.data_inicio.split('-').reverse().join('/')}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {action.titulo}
            </h3>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${getStatusBadge(action.status)}`}>
              {action.status}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl">
          <div>
            <span className="text-slate-400 block font-semibold">Secretaria Responsável:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {sec?.nome || 'Não informada'} ({sec?.sigla})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Horário Previsto:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {action.hora_inicio} {action.hora_fim ? `às ${action.hora_fim}` : ''}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Local de Realização:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{action.local}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Responsável / Coordenação:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{action.responsavel}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Origem do Recurso:</span>
            <span className="font-bold text-amber-600">
              {action.origem_recurso} {action.detalhe_origem ? `(${action.detalhe_origem})` : ''}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Google Agenda:</span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {action.google_event_id ? '✅ Sincronizado' : 'Não vinculado'}
            </span>
          </div>
        </div>

        {action.publico_alvo && (
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Público-alvo:</span>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-600 dark:text-slate-300">
              {action.publico_alvo}
            </div>
          </div>
        )}

        <div className="text-xs space-y-1">
          <span className="font-bold text-slate-700 dark:text-slate-300">Descrição Detalhada:</span>
          <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {action.descricao || 'Sem descrição cadastrada.'}
          </p>
        </div>

        {action.observacoes && (
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Observações Operacionais:</span>
            <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-900 dark:text-amber-200">
              {action.observacoes}
            </div>
          </div>
        )}

        {/* Attached Files List */}
        {action.anexos && action.anexos.length > 0 && (
          <div className="text-xs space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300">Arquivos e Documentos Anexos:</span>
            <div className="space-y-1">
              {action.anexos.map(file => (
                <div key={file.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">{file.nome_arquivo}</span>
                    <span className="text-slate-400 text-[10px]">({file.tamanho_formatado})</span>
                  </div>
                  <a 
                    href={file.url} 
                    download={file.nome_arquivo} 
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => onDelete(action)}
                className="px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Google Calendar Sync Button */}
            <button
              onClick={() => onGoogleSync(action)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{action.google_event_id ? 'Atualizar Google Agenda' : 'Adicionar ao Google Agenda'}</span>
            </button>

            {canEdit && (
              <button
                onClick={() => onEdit(action)}
                className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
