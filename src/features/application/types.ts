export type ApplicationFormData = {
  // Dados Pessoais
  full_name: string;
  birth_date: string;
  email: string;
  whatsapp: string;
  city: string;

  // Formação Acadêmica
  institution: string;
  course: string;
  current_period: string;
  study_shift: string;
  graduation_month?: number;
  graduation_year?: number;

  // Áreas de Interesse
  interest_areas: string[];
  interest_other?: string;
  motivation: string;
  contributions: string;

  // Experiências e Habilidades
  tools?: string;
  has_experience: boolean;

  // Detalhes das Experiências (condicional)
  experience_type?: string;
  experience_type_other?: string;
  experience_org?: string;
  experience_period?: string;
  experience_activities?: string;
  experience_learnings?: string;

  // Informações Complementares
  extra_info?: string;
  how_did_you_hear: string;
  how_did_you_hear_other?: string;

  // CV Upload
  cv_url?: string;

  // LGPD Consent
  lgpd_consent: boolean;
};

export type ApplicationDbPayload = {
  full_name: string;
  birth_date: string;
  email: string;
  whatsapp: string;
  city: string;
  institution: string;
  course: string;
  current_period: string;
  study_shift: string;
  graduation_month: number | null;
  graduation_year: number | null;
  interest_areas: string[];
  interest_other: string | null;
  motivation: string;
  contributions: string;
  tools: string | null;
  has_experience: boolean;
  experience_type: string | null;
  experience_org: string | null;
  experience_period: string | null;
  experience_activities: string | null;
  experience_learnings: string | null;
  extra_info: string | null;
  how_did_you_hear: string;
  how_did_you_hear_other: string | null;
  cv_url: string | null;
  lgpd_consent: boolean;
  lgpd_consent_date: string | null;
  user_id: string | null;
  opportunity_id: string | null;
};

export type ApplicationRecord = ApplicationDbPayload & {
  id: string;
  created_at: string;
};

export const INTEREST_AREAS_OPTIONS = [
  'Tecnologia da Informação / Suporte Técnico',
  'Redes e Infraestrutura',
  'Desenvolvimento de Software',
  'Administração / Gestão',
  'Comunicação / Marketing',
  'Recursos Humanos',
  'Projetos / Inovação',
] as const;

export const PERIOD_OPTIONS = [
  '1º',
  '2º',
  '3º',
  '4º',
  '5º',
  '6º',
  '7º',
  '8º ou mais',
  'Já me formei',
] as const;

export const SHIFT_OPTIONS = [
  'Matutino',
  'Vespertino',
  'Noturno',
  'Integral',
] as const;

export const EXPERIENCE_TYPE_OPTIONS = [
  'Estágio anterior',
  'Emprego anterior',
  'Projeto acadêmico',
  'Trabalho voluntário',
  'Freelancer / autônomo',
] as const;

export const HOW_DID_YOU_HEAR_OPTIONS = [
  'Indicação',
  'LinkedIn',
  'Site da GigaCandanga',
  'Eventos',
] as const;

export const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
] as const;
