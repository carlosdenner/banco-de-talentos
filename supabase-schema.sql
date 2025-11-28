-- ===========================================
-- Banco de Talentos GigaCandanga - Schema SQL
-- Execute este script no SQL Editor do Supabase
-- ===========================================

-- Criar tabela principal de candidaturas
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Dados pessoais
  full_name text not null,
  birth_date date not null,
  email text not null,
  whatsapp text not null,
  city text not null,

  -- Formação acadêmica
  institution text not null,
  course text not null,
  current_period text not null,        -- ex: "3º"
  study_shift text not null,           -- ex: "Noturno"
  graduation_month int,                -- 1-12, opcional
  graduation_year int,                 -- ex: 2026, opcional

  -- Áreas de interesse
  interest_areas text[] not null,      -- lista de áreas marcadas
  interest_other text,
  motivation text not null,
  contributions text not null,

  -- Experiências e habilidades
  tools text,                          -- ferramentas, linguagens etc.
  has_experience boolean not null default false,

  experience_type text,                -- se has_experience = true
  experience_org text,
  experience_period text,
  experience_activities text,
  experience_learnings text,

  -- Informações complementares
  extra_info text,
  how_did_you_hear text,
  how_did_you_hear_other text
);

-- Índice para ordenação por data de criação
create index applications_created_at_idx on public.applications (created_at desc);

-- ===========================================
-- Segurança: Row Level Security (RLS)
-- ===========================================

-- Ativar RLS na tabela
alter table public.applications enable row level security;

-- Política: Permitir apenas INSERT para usuários anônimos
-- Isso permite que o formulário envie dados sem autenticação
create policy "Allow insert from anon"
on public.applications
for insert
to anon
with check (true);

-- NOTA: Não há políticas de SELECT/UPDATE/DELETE para 'anon'
-- Apenas usuários com 'service_role' (dashboard do Supabase) 
-- conseguem ler/exportar os dados.

-- ===========================================
-- Fim do Schema
-- ===========================================
