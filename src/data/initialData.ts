import { Secretariat, MunicipalAction, UserProfile, HeaderFooterConfig, ActionType, ActionStatus } from '../types';

export const INITIAL_SECRETARIAS: Secretariat[] = [
  {
    id: 'sec-meio-ambiente',
    nome: 'Secretaria Municipal de Meio Ambiente',
    sigla: 'SEMMA',
    descricao: 'Preservação ecológica, gestão ambiental, fiscalização e arborização sustentável.',
    icone: 'TreePine',
    cor: '#059669', // Emerald 600
    ativo: true,
    ordem: 1,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-igualdade-racial',
    nome: 'Secretaria Municipal de Igualdade Racial',
    sigla: 'SEMIR',
    descricao: 'Promoção da igualdade étnico-racial, defesa quilombola e direitos humanos.',
    icone: 'Scale',
    cor: '#7c3aed', // Purple 600
    ativo: true,
    ordem: 2,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-cultura',
    nome: 'Secretaria Municipal de Cultura',
    sigla: 'SEMCULT',
    descricao: 'Fomento das manifestações artísticas, salvaguarda do patrimônio e eventos cívicos.',
    icone: 'Palette',
    cor: '#ea580c', // Orange 600
    ativo: true,
    ordem: 3,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-mulher',
    nome: 'Secretaria Municipal da Mulher',
    sigla: 'SEMMU',
    descricao: 'Políticas de acolhimento, proteção social, cidadania e protagonismo feminino.',
    icone: 'HeartHandshake',
    cor: '#db2777', // Pink 600
    ativo: true,
    ordem: 4,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-assistencia-social',
    nome: 'Secretaria Municipal de Assistência Social',
    sigla: 'SEMAS',
    descricao: 'Rede de proteção socioassistencial, suporte às famílias em vulnerabilidade, CRAS e CREAS.',
    icone: 'Users',
    cor: '#2563eb', // Blue 600
    ativo: true,
    ordem: 5,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-educacao',
    nome: 'Secretaria Municipal de Educação',
    sigla: 'SEMED',
    descricao: 'Gestão da rede municipal de ensino, infraestrutura escolar e formação continuada.',
    icone: 'GraduationCap',
    cor: '#0284c7', // Sky 600
    ativo: true,
    ordem: 6,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-agricultura',
    nome: 'Secretaria Municipal de Agricultura Familiar, Abastecimento, Indústria, Comércio, Pesca e Produção',
    sigla: 'SEMAP',
    descricao: 'Apoio aos produtores rurais, feiras comunitárias, piscicultura, comércio e fomento produtivo.',
    icone: 'Wheat',
    cor: '#16a34a', // Green 600
    ativo: true,
    ordem: 7,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  },
  {
    id: 'sec-saude',
    nome: 'Secretaria Municipal de Saúde',
    sigla: 'SEMUS',
    descricao: 'Atenção primária, vigilância epidemiológica, imunização e assistência médico-hospitalar.',
    icone: 'Activity',
    cor: '#dc2626', // Red 600
    ativo: true,
    ordem: 8,
    created_at: '2026-01-01 08:00:00',
    updated_at: '2026-09-01 10:00:00'
  }
];

export const INITIAL_ACTIONS: MunicipalAction[] = [
  {
    id: 'act-001',
    secretaria_id: 'sec-cultura',
    titulo: 'Sarau Quilombola e Encontro de Tradições',
    descricao: 'Apresentação de grupos artísticos tradicionais, bumba meu boi, tambor de crioula e oficinas poéticas populares.',
    data_inicio: '2026-09-17',
    data_fim: '2026-09-17',
    hora_inicio: '19:00',
    hora_fim: '22:00',
    local: 'Praça Negro Cosme - Centro Histórico',
    responsavel: 'Coordenação de Artes e Patrimônio Imaterial',
    tipo: 'Evento',
    status: 'Agendado',
    publico_alvo: 'Comunidade em geral, artistas locais e estudantes',
    observacoes: 'Palco móvel, som e iluminação cênica alinhados.',
    origem_recurso: 'Emenda',
    detalhe_origem: 'Deputado Estadual',
    fotos: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'],
    anexos: [
      {
        id: 'att-01',
        acao_id: 'act-001',
        nome_arquivo: 'Edital_Artistas_Credenciados.pdf',
        tipo_arquivo: 'application/pdf',
        tamanho: 1468006,
        tamanho_formatado: '1.4 MB',
        url: '#',
        created_at: '2026-09-01 10:30'
      }
    ],
    created_at: '2026-09-01 10:30:00',
    updated_at: '2026-09-01 10:30:00'
  },
  {
    id: 'act-002',
    secretaria_id: 'sec-educacao',
    titulo: 'Jornada Pedagógica dos Professores da Rede Básica',
    descricao: 'Alinhamento das diretrizes curriculares do último trimestre letivo e formação continuada de docentes.',
    data_inicio: '2026-09-15',
    data_fim: '2026-09-15',
    hora_inicio: '08:00',
    hora_fim: '17:00',
    local: 'Centro de Formação de Educadores Paulo Freire',
    responsavel: 'Superintendência Pedagógica',
    tipo: 'Capacitação',
    status: 'Concluído',
    publico_alvo: 'Docentes da Educação Infantil e Ensino Fundamental',
    observacoes: 'Certificação de 8h expedida.',
    origem_recurso: 'Recursos Próprios',
    detalhe_origem: 'Orçamento Municipal',
    anexos: [
      {
        id: 'att-02',
        acao_id: 'act-002',
        nome_arquivo: 'Caderno_Metodologico_2026.pdf',
        tipo_arquivo: 'application/pdf',
        tamanho: 3355443,
        tamanho_formatado: '3.2 MB',
        url: '#',
        created_at: '2026-08-25 14:15'
      }
    ],
    created_at: '2026-08-25 14:15:00',
    updated_at: '2026-09-15 18:00:00'
  },
  {
    id: 'act-003',
    secretaria_id: 'sec-meio-ambiente',
    titulo: 'Mutirão de Plantio Urbano e Coleta Eletrônica',
    descricao: 'Distribuição e plantio de mudas nativas em áreas degradadas e ponto de coleta para descarte ecológico.',
    data_inicio: '2026-09-21',
    data_fim: '2026-09-21',
    hora_inicio: '08:30',
    hora_fim: '12:00',
    local: 'Parque Ambiental Ecológico Municipal',
    responsavel: 'Departamento de Educação Ambiental',
    tipo: 'Ação social',
    status: 'Pendente',
    publico_alvo: 'Moradores do entorno, escolas e voluntários',
    observacoes: 'Levar garrafas de água; luvas e pás fornecidas pela secretaria.',
    origem_recurso: 'Parceria',
    detalhe_origem: 'Governo do Estado',
    created_at: '2026-09-02 09:00:00',
    updated_at: '2026-09-02 09:00:00'
  },
  {
    id: 'act-004',
    secretaria_id: 'sec-saude',
    titulo: 'Campanha de Imunização e Exames Preventivos',
    descricao: 'Vacinação multivacinal para crianças e adultos, aferição de pressão e testes rápidos de saúde.',
    data_inicio: '2026-09-10',
    data_fim: '2026-09-10',
    hora_inicio: '08:00',
    hora_fim: '16:00',
    local: 'UBS Central Dr. Manoel Beckman',
    responsavel: 'Coordenação de Atenção Básica',
    tipo: 'Ação de saúde',
    status: 'Em andamento',
    publico_alvo: 'Famílias dos bairros adjacentes e público prioritário',
    observacoes: 'Apresentar Cartão SUS e Documento com foto.',
    origem_recurso: 'Recursos Próprios',
    detalhe_origem: 'Fundo Municipal de Saúde',
    created_at: '2026-09-05 11:20:00',
    updated_at: '2026-09-10 08:30:00'
  },
  {
    id: 'act-005',
    secretaria_id: 'sec-agricultura',
    titulo: 'Feira Municipal da Agricultura Familiar e Pesca Artesanal',
    descricao: 'Comercialização direta de hortaliças, farinha d’água, pescados e mel por produtores locais sem intermediários.',
    data_inicio: '2026-09-19',
    data_fim: '2026-09-19',
    hora_inicio: '06:00',
    hora_fim: '13:00',
    local: 'Mercado Público Municipal',
    responsavel: 'Diretoria de Fomento à Agricultura Familiar',
    tipo: 'Evento',
    status: 'Agendado',
    publico_alvo: 'Consumidores municipais e agricultores cadastrados',
    origem_recurso: 'Parceria',
    detalhe_origem: 'Governo Federal',
    created_at: '2026-09-04 14:00:00',
    updated_at: '2026-09-04 14:00:00'
  },
  {
    id: 'act-006',
    secretaria_id: 'sec-mulher',
    titulo: 'Roda de Conversa: Autonomia Econômica e Empreendedorismo Feminino',
    descricao: 'Oficina de capacitação financeira, formalização MEI e apoio ao artesanato para mulheres chefes de família.',
    data_inicio: '2026-09-24',
    data_fim: '2026-09-24',
    hora_inicio: '14:00',
    hora_fim: '17:30',
    local: 'Casa da Mulher e Cidadania',
    responsavel: 'Coordenadoria de Autonomia Financeira',
    tipo: 'Capacitação',
    status: 'Agendado',
    publico_alvo: 'Mulheres da sede e povoados vizinhos',
    origem_recurso: 'Recursos Próprios',
    detalhe_origem: 'Secretaria da Mulher',
    created_at: '2026-09-06 09:15:00',
    updated_at: '2026-09-06 09:15:00'
  },
  {
    id: 'act-007',
    secretaria_id: 'sec-assistencia-social',
    titulo: 'Atualização Cadastral do CadÚnico nos Povoados Rurais',
    descricao: 'Atendimento itinerante com equipe técnica do CRAS para renovação do Cadastro Único e benefícios socioassistenciais.',
    data_inicio: '2026-09-28',
    data_fim: '2026-09-29',
    hora_inicio: '08:00',
    hora_fim: '15:00',
    local: 'Escola Municipal do Povoado Santa Rosa',
    responsavel: 'Coordenação Municipal do Cadastro Único',
    tipo: 'Atendimento',
    status: 'Pendente',
    publico_alvo: 'Famílias rurais com cadastro desatualizado',
    origem_recurso: 'Parceria',
    detalhe_origem: 'Governo Federal',
    created_at: '2026-09-07 10:00:00',
    updated_at: '2026-09-07 10:00:00'
  },
  {
    id: 'act-008',
    secretaria_id: 'sec-igualdade-racial',
    titulo: 'Conferência Municipal de Igualdade Étnico-Racial',
    descricao: 'Debate de propostas e diretrizes para o fortalecimento das políticas públicas quilombolas e combate ao racismo institucional.',
    data_inicio: '2026-09-30',
    data_fim: '2026-09-30',
    hora_inicio: '08:30',
    hora_fim: '17:00',
    local: 'Auditório da Câmara Municipal',
    responsavel: 'Conselho Municipal de Igualdade Racial',
    tipo: 'Audiência Pública',
    status: 'Agendado',
    publico_alvo: 'Lideranças comunitárias, juventude negra e sociedade civil',
    origem_recurso: 'Emenda',
    detalhe_origem: 'Vereador',
    created_at: '2026-09-08 11:30:00',
    updated_at: '2026-09-08 11:30:00'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    nome: 'Administrador Geral (ASCOM)',
    email: 'ascomitapecuru@gmail.com',
    perfil: 'Administrador',
    ativo: true,
    ultimo_acesso: '2026-09-10 16:10',
    observacoes: 'Conta principal de administração institucional'
  },
  {
    id: 'user-editor',
    nome: 'Editor de Conteúdo (ASCOM)',
    email: 'editor@itapecuru.gov.br',
    perfil: 'Editor',
    ativo: true,
    ultimo_acesso: '2026-09-10 14:30',
    observacoes: 'Conta editorial para inclusão e acompanhamento das ações'
  },
  {
    id: 'user-visualizador',
    nome: 'Cidadão / Visitante Público',
    email: 'cidadao@prefeitura.gov.br',
    perfil: 'Visualizador',
    ativo: true,
    ultimo_acesso: '2026-09-10 16:14',
    observacoes: 'Perfil público padrão (modo somente consulta)'
  }
];

export const INITIAL_LAYOUT: HeaderFooterConfig = {
  portalTitulo: 'CALENDÁRIO DE AÇÕES',
  portalSubtitulo: 'Planejamento, organização e acompanhamento das ações das Secretarias Municipais',
  portalLogoUrl: '',
  faixaSuperior: 'Portal da Transparência & Gestão Integrada',
  rodapeTitulo: 'CALENDÁRIO DE AÇÕES',
  rodapeDescricao: 'Sistema Integrado de Gestão e Planejamento Municipal',
  rodapeCopyright: '© 2026 Prefeitura Municipal • Todos os direitos reservados'
};

export const ACTION_TYPES: ActionType[] = [
  'Evento', 'Reunião', 'Campanha', 'Atendimento', 
  'Audiência Pública', 'Capacitação', 'Visita técnica', 
  'Ação social', 'Ação de saúde', 'Ação educacional', 
  'Comunicação', 'Outros'
];

export const ACTION_STATUSES: ActionStatus[] = [
  'Pendente', 'Agendado', 'Em andamento', 'Concluído', 'Cancelado'
];

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
