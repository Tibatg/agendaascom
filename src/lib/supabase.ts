import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export interface SupabaseUsuarioRow {
  id: string;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Editor' | 'Visualizador';
  secretaria_id: string | null;
  ativo: boolean;
  ultimo_acesso: string | null;
  observacoes: string | null;
}

export async function fetchUsuariosFromSupabase(): Promise<SupabaseUsuarioRow[]> {
  if (!supabase) throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('Faça login com uma conta autenticada para sincronizar os usuários.');

  const { data, error } = await supabase
    .from('usuarios')
    .select('id,nome,email,perfil,secretaria_id,ativo,ultimo_acesso,observacoes')
    .order('nome', { ascending: true });

  if (error) throw new Error(`Não foi possível ler os usuários: ${error.message}`);
  return (data ?? []) as SupabaseUsuarioRow[];
}

export async function updateUsuarioStatus(id: string, ativo: boolean) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('usuarios').update({ ativo, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(`Não foi possível atualizar o status: ${error.message}`);
}

export async function updateUsuarioPerfil(user: SupabaseUsuarioRow) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('usuarios').update({
    nome: user.nome,
    perfil: user.perfil,
    secretaria_id: user.secretaria_id,
    observacoes: user.observacoes,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);
  if (error) throw new Error(`Não foi possível atualizar o usuário: ${error.message}`);
}
