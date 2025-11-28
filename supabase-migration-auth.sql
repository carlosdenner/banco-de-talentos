-- ===========================================
-- Migration: Add Authentication & CV Storage
-- Execute no SQL Editor do Supabase
-- ===========================================

-- 1. Adicionar coluna user_id à tabela applications
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Adicionar coluna para URL do CV
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS cv_url text;

-- 3. Criar índice para buscar por user_id
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications (user_id);

-- 4. Atualizar políticas RLS

-- Remover política antiga de insert anon (se existir)
DROP POLICY IF EXISTS "Allow insert from anon" ON public.applications;

-- Política: Permitir INSERT para usuários anônimos (sem user_id)
CREATE POLICY "Allow anonymous insert"
ON public.applications
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Política: Permitir INSERT para usuários autenticados (com seu user_id)
CREATE POLICY "Allow authenticated insert"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Permitir SELECT apenas do próprio registro
CREATE POLICY "Users can view own application"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Permitir UPDATE apenas do próprio registro
CREATE POLICY "Users can update own application"
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- 5. Configurar Storage para CVs
-- ===========================================

-- Criar bucket para CVs (execute isso separadamente se der erro)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Política: Usuários autenticados podem fazer upload do próprio CV
CREATE POLICY "Users can upload own CV"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários autenticados podem visualizar seu próprio CV
CREATE POLICY "Users can view own CV"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários autenticados podem deletar seu próprio CV
CREATE POLICY "Users can delete own CV"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ===========================================
-- Fim da Migration
-- ===========================================
