import React, { useState, useMemo } from 'react';
import { FileText, Download, Search, HardDrive, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { ActionAttachment, MunicipalAction, Secretariat } from '../types';

interface ArquivosTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  onSelectAction: (action: MunicipalAction) => void;
}

export const ArquivosTab: React.FC<ArquivosTabProps> = ({
  acoes,
  secretarias,
  onSelectAction
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const allFiles = useMemo(() => {
    const list: { attachment: ActionAttachment; action: MunicipalAction; sec?: Secretariat }[] = [];
    acoes.forEach(action => {
      const sec = secretarias.find(s => s.id === action.secretaria_id);
      action.anexos?.forEach(att => {
        list.push({ attachment: att, action, sec });
      });
    });
    return list;
  }, [acoes, secretarias]);

  const filteredFiles = useMemo(() => {
    return allFiles.filter(({ attachment, action, sec }) => {
      if (typeFilter !== 'todos') {
        const ext = attachment.nome_arquivo.split('.').pop()?.toLowerCase() || '';
        if (typeFilter === 'pdf' && ext !== 'pdf') return false;
        if (typeFilter === 'doc' && !['doc', 'docx', 'txt'].includes(ext)) return false;
        if (typeFilter === 'img' && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return false;
        if (typeFilter === 'plan' && !['xls', 'xlsx', 'csv'].includes(ext)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = attachment.nome_arquivo.toLowerCase().includes(q);
        const matchAction = action.titulo.toLowerCase().includes(q);
        const matchSec = sec?.nome.toLowerCase().includes(q) || sec?.sigla.toLowerCase().includes(q);
        if (!matchName && !matchAction && !matchSec) return false;
      }
      return true;
    });
  }, [allFiles, search, typeFilter]);

  const totalBytes = useMemo(() => {
    return allFiles.reduce((acc, f) => acc + (f.attachment.tamanho || 0), 0);
  }, [allFiles]);

  const formatTotalSize = (bytes: number) => {
    if (bytes > 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Repositório Digital Institucional
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
            Arquivos e Documentos das Ações
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Armazenamento unificado de editais, termos de referência, fotos e relatórios de atividades
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-800 dark:text-blue-300">
          <HardDrive className="w-4 h-4" />
          <span>{allFiles.length} arquivos ({formatTotalSize(totalBytes)})</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do arquivo, ação vinculada ou secretaria..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="todos">Todos os Formatos</option>
            <option value="pdf">Documentos PDF (.pdf)</option>
            <option value="doc">Textos Word (.doc, .docx)</option>
            <option value="img">Imagens (.jpg, .png)</option>
            <option value="plan">Planilhas (.xls, .xlsx)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Arquivo</th>
                <th className="p-4">Tipo & Formato</th>
                <th className="p-4">Tamanho</th>
                <th className="p-4">Ação Vinculada</th>
                <th className="p-4">Secretaria</th>
                <th className="p-4">Enviado por</th>
                <th className="p-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Nenhum arquivo encontrado no repositório digital.
                  </td>
                </tr>
              ) : (
                filteredFiles.map(({ attachment, action, sec }) => (
                  <tr key={attachment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate max-w-xs">{attachment.nome_arquivo}</span>
                    </td>
                    <td className="p-4 uppercase font-semibold text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">
                        {attachment.nome_arquivo.split('.').pop() || 'ARQ'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">{attachment.tamanho_formatado}</td>
                    <td 
                      onClick={() => onSelectAction(action)}
                      className="p-4 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {action.titulo}
                    </td>
                    <td className="p-4">{sec?.sigla}</td>
                    <td className="p-4 text-slate-400">{attachment.enviado_por || 'Coordenação'}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <a
                        href={attachment.url}
                        download={attachment.nome_arquivo}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Baixar
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
