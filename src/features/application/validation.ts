import { z } from 'zod';

export const stepDadosPessoaisSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  email: z.string().email('Informe um e-mail válido'),
  whatsapp: z.string().min(10, 'Informe um telefone válido'),
  city: z.string().min(2, 'Informe sua cidade'),
});

export const stepFormacaoSchema = z.object({
  institution: z.string().min(2, 'Informe a instituição de ensino'),
  course: z.string().min(2, 'Informe o curso'),
  current_period: z.string().min(1, 'Selecione o período atual'),
  study_shift: z.string().min(1, 'Selecione o turno de estudo'),
  graduation_month: z.number().min(1).max(12).optional(),
  graduation_year: z.number().min(2024).max(2035).optional(),
});

export const stepAreasInteresseSchema = z.object({
  interest_areas: z.array(z.string()).min(1, 'Selecione pelo menos uma área de interesse'),
  interest_other: z.string().optional(),
  motivation: z.string().min(10, 'Descreva sua motivação (mínimo 10 caracteres)'),
  contributions: z.string().min(10, 'Descreva suas contribuições (mínimo 10 caracteres)'),
});

export const stepExperienciasHabilidadesSchema = z.object({
  tools: z.string().optional(),
  has_experience: z.boolean(),
});

export const stepDetalhesExperienciasSchema = z.object({
  experience_type: z.string().min(1, 'Selecione o tipo de experiência'),
  experience_type_other: z.string().optional(),
  experience_org: z.string().min(2, 'Informe o nome da organização'),
  experience_period: z.string().min(3, 'Informe o período de atuação'),
  experience_activities: z.string().min(10, 'Descreva as atividades (mínimo 10 caracteres)'),
  experience_learnings: z.string().min(10, 'Descreva o que aprendeu (mínimo 10 caracteres)'),
});

export const stepInformacoesComplementaresSchema = z.object({
  extra_info: z.string().optional(),
  how_did_you_hear: z.string().min(1, 'Selecione uma opção'),
  how_did_you_hear_other: z.string().optional(),
  lgpd_consent: z.literal(true, 'Você deve aceitar a Política de Privacidade para continuar'),
});

export const fullApplicationSchema = z.object({
  ...stepDadosPessoaisSchema.shape,
  ...stepFormacaoSchema.shape,
  ...stepAreasInteresseSchema.shape,
  ...stepExperienciasHabilidadesSchema.shape,
  ...stepDetalhesExperienciasSchema.shape,
  ...stepInformacoesComplementaresSchema.shape,
});
