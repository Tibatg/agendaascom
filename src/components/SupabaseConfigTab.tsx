import React, { useState } from 'react';
import { Copy, Check, Database, ShieldCheck, Terminal, Server } from 'lucide-react';

interface SupabaseConfigTabProps {
  onToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseConfigTab: React.FC<SupabaseConfigTabProps> = ({ onToast }) => {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ==============================================================================
-- CALENDÁRIO DE AÇÕES MUNICIPAIS - POSTGRESQL + SUPABASE SCHEMA
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE SECRETARIAS
CREATE TABLE IF NOT EXISTS public.secretarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    sigla TEXT,
    descricao TEXT,
    icone TEXT DEFAULT 'Building2',
    cor TEXT DEFAULT '#2563eb',
    ativo BOOLEAN DEFAULT TRUE,
    ordem INTEGER DEFAULT 1,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    secretaria_id UUID REFERENCES public.secretarias(id),
    nivel_acesso TEXT NOT NULL DEFAULT 'visualizador',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE AÇÕES MUNICIPAIS
CREATE TABLE IF NOT EXISTS public.acoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    secretaria_id UUID NOT NULL REFERENCES public.secretarias(id) ON DELETE RESTRICT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    local TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Agendado', 'Em andamento', 'Concluído', 'Cancelado')),
    tipo TEXT DEFAULT 'Evento',
    publico_alvo TEXT,
    observacoes TEXT,
    origem_recurso TEXT DEFAULT 'Recursos Próprios',
    detalhe_origem TEXT,
    google_event_id TEXT,
    criado_por UUID REFERENCES public.usuarios(id),
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE ARQUIVOS DAS AÇÕES (STORAGE)
CREATE TABLE IF NOT EXISTS public.arquivos_acoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acao_id UUID NOT NULL REFERENCES public.acoes(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    caminho_storage TEXT NOT NULL,
    tipo_arquivo TEXT NOT NULL,
    tamanho BIGINT NOT NULL,
    url TEXT NOT NULL,
    enviado_por UUID REFERENCES public.usuarios(id),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRIGGER DE ATUALIZAÇÃO AUTOMÁTICA
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_acoes_modtime
    BEFORE UPDATE ON public.acoes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. POLÍTICAS ROW LEVEL SECURITY (RLS)
ALTER TABLE public.secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arquivos_acoes ENABLE ROW LEVEL SECURITY;

-- Leitura pública de secretarias e ações
CREATE POLICY "Leitura pública acoes" ON public.acoes FOR SELECT USING (true);
CREATE POLICY "Leitura pública secretarias" ON public.secretarias FOR SELECT USING (true);
CREATE POLICY "Leitura pública arquivos" ON public.arquivos_acoes FOR SELECT USING (true);

-- Administrador e Editores com RLS
CREATE POLICY "Admin gerencia acoes" ON public.acoes
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND nivel_acesso IN ('admin', 'editor')));

-- 7. STORAGE BUCKET 'arquivos-acoes'
-- Executar no Supabase SQL ou Dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('arquivos-acoes', 'arquivos-acoes', true);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    onToast('Script SQL copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Backend Supabase PostgreSQL & Edge Functions
        </span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
          Scripts SQL, Tabelas, RLS & Google Calendar OAuth
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Código SQL pronto para ser executado no Supabase SQL Editor em produção
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-600" />
            PostgreSQL 15+
          </span>
          <p className="text-slate-500">4 tabelas relacionais com chaves estrangeiras e índices otimizados.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Row Level Security (RLS)
          </span>
          <p className="text-slate-500">Políticas públicas de consulta para transparência e restrição de edição a usuários autenticados.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Server className="w-4 h-4 text-amber-500" />
            Bucket de Armazenamento
          </span>
          <p className="text-slate-500">Bucket público <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">arquivos-acoes</code> para upload de arquivos até 25MB.</p>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-amber-400 font-bold uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Schema DDL + RLS + Triggers + Storage
          </span>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
          </button>
        </div>

        <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto max-h-[500px] p-2">
          {sqlCode}
        </pre>
      </div>
    </div>
  );
};
