import React, { useState } from 'react';
import { HardDrive, FileDown, FileUp, Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Secretariat, MunicipalAction, UserProfile } from '../types';

interface BackupTabProps {
  acoes: MunicipalAction[];
  secretarias: Secretariat[];
  usuarios: UserProfile[];
  onRestoreBackup: (parsedData: any) => void;
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  onLogAudit: (acao: string, registro: string, tipo: any, detalhes?: string) => void;
}

export const BackupTab: React.FC<BackupTabProps> = ({
  acoes,
  secretarias,
  usuarios,
  onRestoreBackup,
  onToast,
  onLogAudit
}) => {
  const [backupStats, setBackupStats] = useState<{
    totalEncontrados: number;
    importados: number;
    atualizados: number;
  } | null>(null);

  const handleExportBackupJSON = () => {
    const now = new Date().toISOString().slice(0, 10);
    const backupPayload = {
      sistema: "Calendário de Ações",
      versao: "1.0",
      exportado_em: new Date().toISOString(),
      secretarias: secretarias,
      usuarios: usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email, perfil: u.perfil, ativo: u.ativo })),
      acoes: acoes,
      arquivos: acoes.flatMap(a => a.anexos || [])
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup-calendario-${now}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onLogAudit('Backup exportado', `Arquivo: backup-calendario-${now}.json`, 'BACKUP', `${acoes.length} ações e ${secretarias.length} secretarias`);
    onToast('Backup JSON gerado e baixado com sucesso!', 'success');
  };

  const handleSelectBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.sistema || !json.versao || !Array.isArray(json.secretarias) || !Array.isArray(json.acoes)) {
          onToast('Arquivo de backup inválido ou estrutura corrompida.', 'error');
          return;
        }
        onRestoreBackup(json);
      } catch (err) {
        onToast('Falha ao processar arquivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Segurança de Dados & Continuidade
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
          Backup e Restauração em JSON
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Exportação de dump completo das tabelas e importação segura com prevenção contra duplicação (UPSERT)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Exportar Backup Completo</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gera um arquivo padronizado <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">backup-calendario-AAAA-MM-DD.json</code> contendo secretarias, ações, anexos e metadados.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div>Ações a incluir: <strong>{acoes.length}</strong></div>
            <div>Secretarias: <strong>{secretarias.length}</strong></div>
            <div>Usuários: <strong>{usuarios.length}</strong></div>
          </div>

          <button
            onClick={handleExportBackupJSON}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup (JSON)</span>
          </button>
        </div>

        {/* Import Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Importar / Restaurar Backup</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Valida a versão e integridade do arquivo JSON e atualiza os registros existentes sem duplicar dados.
            </p>
          </div>

          {backupStats && (
            <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-900 text-xs space-y-1">
              <div className="font-bold text-blue-800 dark:text-blue-200">Resultado do último processo:</div>
              <div>Registros encontrados: <strong>{backupStats.totalEncontrados}</strong></div>
              <div>Importados novos: <strong>{backupStats.importados}</strong></div>
              <div>Atualizados: <strong>{backupStats.atualizados}</strong></div>
            </div>
          )}

          <label className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Selecionar Arquivo JSON</span>
            <input type="file" accept=".json" onChange={handleSelectBackupFile} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
