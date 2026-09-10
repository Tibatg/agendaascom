import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AuditLog, MunicipalAction, Secretariat, UserProfile } from '../types';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseUrl = rawSupabaseUrl?.trim().replace(/^['"]|['"]$/g, '').replace(/\/rest\/v1\/?$/, '');
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim().replace(/^['"]|['"]$/g, '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

const requireClient = () => {
  if (!supabase) throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
  return supabase;
};

const requireSession = async () => {
  const client = requireClient();
  const { data } = await client.auth.getSession();
  if (!data.session) throw new Error('Faça login para salvar alterações no servidor.');
  return client;
};

export interface SupabaseUsuarioRow extends UserProfile { secretaria_id: string | null; ultimo_acesso: string | null; observacoes: string | null; }

export async function signInWithSupabase(email: string, password: string) {
  const client = requireClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Não foi possível entrar no Supabase. Confira o e-mail, a senha e se o e-mail foi confirmado.');
}

export async function signOutFromSupabase() { if (supabase) await supabase.auth.signOut(); }

export async function fetchUsuariosFromSupabase(): Promise<SupabaseUsuarioRow[]> {
  const client = await requireSession();
  const { data, error } = await client.from('usuarios').select('id,nome,email,perfil,secretaria_id,ativo,ultimo_acesso,observacoes').order('nome');
  if (error) throw new Error(`Não foi possível ler os usuários: ${error.message}`);
  return (data ?? []) as SupabaseUsuarioRow[];
}

export async function updateUsuarioStatus(id: string, ativo: boolean) { const client = await requireSession(); const { error } = await client.from('usuarios').update({ ativo, updated_at: new Date().toISOString() }).eq('id', id); if (error) throw new Error(`Não foi possível atualizar o status: ${error.message}`); }
export async function updateUsuarioPerfil(user: SupabaseUsuarioRow) { const client = await requireSession(); const { error } = await client.from('usuarios').update({ nome: user.nome, perfil: user.perfil, secretaria_id: user.secretaria_id, observacoes: user.observacoes, updated_at: new Date().toISOString() }).eq('id', user.id); if (error) throw new Error(`Não foi possível atualizar o usuário: ${error.message}`); }

export async function fetchRemoteData() {
  const client = requireClient();
  const [secretarias, acoes, auditoria] = await Promise.all([
    client.from('secretarias').select('*').order('ordem').order('nome'),
    client.from('acoes').select('*').order('data_inicio', { ascending: true }),
    client.from('auditoria').select('*').order('created_at', { ascending: false }).limit(500),
  ]);
  if (secretarias.error) throw new Error(`Não foi possível carregar secretarias: ${secretarias.error.message}`);
  if (acoes.error) throw new Error(`Não foi possível carregar ações: ${acoes.error.message}`);
  if (auditoria.error) throw new Error(`Não foi possível carregar auditoria: ${auditoria.error.message}`);
  return { secretarias: (secretarias.data ?? []) as Secretariat[], acoes: (acoes.data ?? []) as MunicipalAction[], auditLogs: (auditoria.data ?? []) as AuditLog[] };
}

export async function upsertSecretaria(value: Secretariat) { const client = await requireSession(); const { error } = await client.from('secretarias').upsert(value, { onConflict: 'id' }); if (error) throw new Error(`Não foi possível salvar a secretaria: ${error.message}`); }
export async function upsertAcao(value: MunicipalAction) { const client = await requireSession(); const row = { ...value, fotos: value.fotos ?? [], anexos: value.anexos ?? [], historico: value.historico ?? [] }; const { error } = await client.from('acoes').upsert(row, { onConflict: 'id' }); if (error) throw new Error(`Não foi possível salvar a ação: ${error.message}`); }
export async function deleteAcao(id: string) { const client = await requireSession(); const { error } = await client.from('acoes').delete().eq('id', id); if (error) throw new Error(`Não foi possível excluir a ação: ${error.message}`); }
export async function upsertAuditoria(value: AuditLog) { const client = await requireSession(); const { error } = await client.from('auditoria').upsert(value, { onConflict: 'id' }); if (error) throw new Error(`Não foi possível salvar a auditoria: ${error.message}`); }

export function subscribeToRemoteChanges(onChange: () => void) {
  if (!supabase) return () => undefined;
  const channel = supabase.channel('agendaascom-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'secretarias' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'acoes' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'auditoria' }, onChange)
    .subscribe();
  return () => { void supabase.removeChannel(channel); };
}

export function toUserProfile(user: SupabaseUsuarioRow): UserProfile { return { ...user, secretaria_id: user.secretaria_id || undefined, ultimo_acesso: user.ultimo_acesso ? new Date(user.ultimo_acesso).toLocaleString('pt-BR') : 'Nunca acessou', observacoes: user.observacoes || undefined }; }
export async function persistSessionLog(log: AuditLog) { try { await upsertAuditoria(log); } catch { /* auditoria não deve bloquear a operação principal */ } }
export async function getCurrentSessionUser() { if (!supabase) return null; const { data } = await supabase.auth.getUser(); return data.user; }
export async function persistAllRemote(secretarias: Secretariat[], acoes: MunicipalAction[]) { const client = await requireSession(); const results = await Promise.all([client.from('secretarias').upsert(secretarias, { onConflict: 'id' }), client.from('acoes').upsert(acoes.map(a => ({ ...a, fotos: a.fotos ?? [], anexos: a.anexos ?? [], historico: a.historico ?? [] })), { onConflict: 'id' })]); const failure = results.find(result => result.error); if (failure?.error) throw new Error(`Não foi possível sincronizar os dados: ${failure.error.message}`); }
export { requireSession };
