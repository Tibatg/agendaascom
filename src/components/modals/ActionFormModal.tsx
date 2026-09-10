import React, { useState, useEffect } from 'react';
import { X, Paperclip, Upload, Trash2, Coins } from 'lucide-react';
import { 
  MunicipalAction, 
  Secretariat, 
  ActionStatus, 
  ActionType, 
  OrigemRecurso,
  ActionAttachment 
} from '../../types';
import { ACTION_TYPES, ACTION_STATUSES } from '../../data/initialData';

interface ActionFormModalProps {
  isOpen: boolean;
  editingAction: MunicipalAction | null;
  secretarias: Secretariat[];
  defaultDate?: string;
  defaultSecretariaId?: string;
  currentUserName: string;
  onClose: () => void;
  onSave: (data: Partial<MunicipalAction>, attachments: ActionAttachment[]) => void;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ActionFormModal: React.FC<ActionFormModalProps> = ({
  isOpen,
  editingAction,
  secretarias,
  defaultDate,
  defaultSecretariaId,
  currentUserName,
  onClose,
  onSave,
  onToast
}) => {
  const [formData, setFormData] = useState<Partial<MunicipalAction>>({
    titulo: '',
    secretaria_id: '',
    data_inicio: '',
    data_fim: '',
    hora_inicio: '09:00',
    hora_fim: '11:00',
    local: '',
    responsavel: '',
    tipo: 'Evento',
    status: 'Pendente',
    publico_alvo: '',
    descricao: '',
    observacoes: '',
    origem_recurso: 'Recursos Próprios',
    detalhe_origem: ''
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<ActionAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAction) {
      setFormData({ ...editingAction });
      setUploadedAttachments(editingAction.anexos || []);
    } else {
      setFormData({
        titulo: '',
        secretaria_id: defaultSecretariaId || (secretarias[0]?.id || ''),
        data_inicio: defaultDate || '2026-09-10',
        data_fim: defaultDate || '2026-09-10',
        hora_inicio: '09:00',
        hora_fim: '11:00',
        local: '',
        responsavel: currentUserName || 'Coordenação',
        tipo: 'Evento',
        status: 'Pendente',
        publico_alvo: 'Público em geral',
        descricao: '',
        observacoes: '',
        origem_recurso: 'Recursos Próprios',
        detalhe_origem: ''
      });
      setUploadedAttachments([]);
    }
    setErrors({});
  }, [editingAction, defaultDate, defaultSecretariaId, secretarias, currentUserName, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB

    Array.from(files).forEach((file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(ext)) {
        onToast(`Extensão .${ext} não suportada. Permitidos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP.`, 'error');
        return;
      }
      if (file.size > maxSizeBytes) {
        onToast(`Arquivo "${file.name}" excede o limite de 25MB.`, 'error');
        return;
      }

      const sizeFormatted = file.size > 1048576 
        ? `${(file.size / 1048576).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      const newAttachment: ActionAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        acao_id: editingAction?.id || 'draft',
        nome_arquivo: file.name,
        caminho_storage: `/acao/${editingAction?.id || 'temp'}/${file.name}`,
        tipo_arquivo: file.type || ext,
        tamanho: file.size,
        tamanho_formatado: sizeFormatted,
        url: URL.createObjectURL(file),
        enviado_por: currentUserName,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };

      setUploadedAttachments(prev => [...prev, newAttachment]);
      onToast(`Arquivo "${file.name}" anexado com sucesso!`, 'success');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.titulo?.trim()) newErrors.titulo = 'Título da ação é obrigatório.';
    if (!formData.secretaria_id) newErrors.secretaria_id = 'Secretaria é obrigatória.';
    if (!formData.data_inicio) newErrors.data_inicio = 'Data inicial é obrigatória.';
    if (!formData.local?.trim()) newErrors.local = 'Local é obrigatório.';
    if (!formData.responsavel?.trim()) newErrors.responsavel = 'Responsável é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onToast('Preencha os campos obrigatórios destacados.', 'error');
      return;
    }

    onSave(formData, uploadedAttachments);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
            {editingAction ? 'Editar Ação Municipal' : 'Nova Ação Municipal'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold block mb-1">Título da Ação *</label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Mutirão de Limpeza Urbana e Arborização"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
            />
            {errors.titulo && <span className="text-rose-600 text-[11px]">{errors.titulo}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold block mb-1">Secretaria Responsável *</label>
              <select
                required
                value={formData.secretaria_id}
                onChange={(e) => setFormData(prev => ({ ...prev, secretaria_id: e.target.value }))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                {secretarias.filter(s => s.ativo).map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.sigla} - {sec.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Tipo de Ação *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as ActionType }))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                {ACTION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Status da Ação *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ActionStatus }))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                {ACTION_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold block mb-1">Data Inicial *</label>
              <input
                type="date"
                required
                value={formData.data_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Data Final</label>
              <input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Hora Inicial</label>
              <input
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Hora Final</label>
              <input
                type="time"
                value={formData.hora_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Local da Realização *</label>
              <input
                type="text"
                required
                value={formData.local}
                onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                placeholder="Ex: Praça Central ou Auditório Municipal"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Responsável / Coordenação *</label>
              <input
                type="text"
                required
                value={formData.responsavel}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                placeholder="Ex: Coordenação de Eventos"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Origem do Recurso</label>
              <select
                value={formData.origem_recurso}
                onChange={(e) => setFormData(prev => ({ ...prev, origem_recurso: e.target.value as OrigemRecurso }))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="Recursos Próprios">Recursos Próprios</option>
                <option value="Emenda">Emenda Parlamentar</option>
                <option value="Parceria">Parceria Institucional</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
            <div>
              <label className="font-bold block mb-1">Detalhe da Origem (Ex: Vereador, Deputado, etc.)</label>
              <input
                type="text"
                value={formData.detalhe_origem}
                onChange={(e) => setFormData(prev => ({ ...prev, detalhe_origem: e.target.value }))}
                placeholder="Ex: Deputado Estadual ou Governo Federal"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Público-Alvo</label>
            <input
              type="text"
              value={formData.publico_alvo}
              onChange={(e) => setFormData(prev => ({ ...prev, publico_alvo: e.target.value }))}
              placeholder="Ex: Produtores rurais, estudantes e sociedade civil"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Descrição</label>
            <textarea
              rows={2}
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Informações e objetivos da ação..."
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {/* Anexos de Arquivos Storage */}
          <div className="border border-dashed border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center space-y-2 bg-slate-50 dark:bg-slate-800/40">
            <Paperclip className="w-5 h-5 text-blue-500 mx-auto" />
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Anexar Documentos e Imagens</span>
            <p className="text-[10px] text-slate-400">Suporta PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP (limite de 25MB)</p>
            
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Escolher Arquivos</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>

            {uploadedAttachments.length > 0 && (
              <div className="pt-2 text-left space-y-1">
                {uploadedAttachments.map((att, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                    <span className="truncate max-w-sm">{att.nome_arquivo} ({att.tamanho_formatado})</span>
                    <button
                      type="button"
                      onClick={() => setUploadedAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Salvar Ação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
