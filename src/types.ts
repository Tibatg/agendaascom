export type UserRole = 'Administrador' | 'Editor' | 'Visualizador';

export type TipoEmenda = 'Vereador' | 'Deputado Estadual' | 'Deputado Federal' | 'Senador';
export type TipoParceria = 'Governo do Estado' | 'Governo Federal';
export type OrigemRecurso = 'Emenda' | 'Parceria' | 'Recursos Próprios' | 'Geral';

export type ActionStatus = 
  | 'Pendente' 
  | 'Agendado' 
  | 'Em andamento' 
  | 'Concluído' 
  | 'Cancelado';

export type ActionType = 
  | 'Evento' 
  | 'Reunião' 
  | 'Campanha' 
  | 'Atendimento' 
  | 'Audiência Pública' 
  | 'Capacitação' 
  | 'Visita técnica' 
  | 'Ação social' 
  | 'Ação de saúde' 
  | 'Ação educacional' 
  | 'Comunicação' 
  | 'Outros';

export type CalendarViewMode = 'mensal' | 'semanal' | 'diaria' | 'lista';

export type TabType = 
  | 'inicio' 
  | 'calendario-geral' 
  | 'calendario-secretaria' 
  | 'acoes' 
  | 'secretarias' 
  | 'responsaveis' 
  | 'arquivos' 
  | 'pesquisa' 
  | 'dashboard' 
  | 'relatorios' 
  | 'backup' 
  | 'usuarios' 
  | 'config-supabase' 
  | 'auditoria';

export interface Secretariat {
  id: string;
  nome: string;
  sigla: string;
  descricao: string;
  icone: string;
  cor: string;
  ativo: boolean;
  ordem: number;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionAttachment {
  id: string;
  acao_id: string;
  nome_arquivo: string;
  caminho_storage?: string;
  tipo_arquivo: string;
  tamanho: number; // bytes
  tamanho_formatado: string;
  url: string;
  enviado_por?: string;
  created_at: string;
}

export interface ActionHistory {
  id: string;
  acao_id: string;
  usuario_nome: string;
  tipo_alteracao: 'criação' | 'edição' | 'alteração de status' | 'exclusão' | 'alteração de data' | 'alteração de horário' | 'alteração de Secretaria' | 'sincronização google';
  descricao: string;
  created_at: string;
}

export interface MunicipalAction {
  id: string;
  secretaria_id: string;
  titulo: string;
  descricao: string;
  data_inicio: string; // YYYY-MM-DD
  data_fim?: string;   // YYYY-MM-DD
  hora_inicio: string; // HH:MM
  hora_fim?: string;   // HH:MM
  local: string;
  responsavel: string;
  tipo: ActionType;
  status: ActionStatus;
  publico_alvo?: string;
  observacoes?: string;
  link?: string;
  origem_recurso?: OrigemRecurso;
  detalhe_origem?: string;
  google_event_id?: string;
  fotos?: string[];
  anexos?: ActionAttachment[];
  historico?: ActionHistory[];
  criado_por?: string;
  atualizado_por?: string;
  created_at: string;
  updated_at: string;
}

export interface HeaderFooterConfig {
  portalTitulo: string;
  portalSubtitulo: string;
  portalLogoUrl: string;
  faixaSuperior: string;
  rodapeTitulo: string;
  rodapeDescricao: string;
  rodapeCopyright: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  secretaria_id?: string;
  ativo: boolean;
  ultimo_acesso?: string;
  observacoes?: string;
}

export interface AuditLog {
  id: string;
  usuario_nome: string;
  usuario_email: string;
  perfil: UserRole;
  acao_realizada: string;
  registro_alterado: string;
  tipo_operacao: 'INSERT' | 'UPDATE' | 'DELETE' | 'AUTH' | 'PERMISSION' | 'BACKUP' | 'SYNC';
  dados_relevantes?: string;
  created_at: string;
}
