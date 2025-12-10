-- ===========================================
-- Migration: Add missing columns to applications table
-- Run this in Supabase SQL Editor
-- ===========================================

-- Add missing columns from the original schema
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS institution text,
ADD COLUMN IF NOT EXISTS course text,
ADD COLUMN IF NOT EXISTS current_period text,
ADD COLUMN IF NOT EXISTS study_shift text,
ADD COLUMN IF NOT EXISTS graduation_month int,
ADD COLUMN IF NOT EXISTS graduation_year int,
ADD COLUMN IF NOT EXISTS interest_areas text[],
ADD COLUMN IF NOT EXISTS interest_other text,
ADD COLUMN IF NOT EXISTS motivation text,
ADD COLUMN IF NOT EXISTS contributions text,
ADD COLUMN IF NOT EXISTS tools text,
ADD COLUMN IF NOT EXISTS has_experience boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS experience_type text,
ADD COLUMN IF NOT EXISTS experience_org text,
ADD COLUMN IF NOT EXISTS experience_period text,
ADD COLUMN IF NOT EXISTS experience_activities text,
ADD COLUMN IF NOT EXISTS experience_learnings text,
ADD COLUMN IF NOT EXISTS extra_info text,
ADD COLUMN IF NOT EXISTS how_did_you_hear text,
ADD COLUMN IF NOT EXISTS how_did_you_hear_other text,
ADD COLUMN IF NOT EXISTS lgpd_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lgpd_consent_date timestamptz;

-- Make required columns NOT NULL (only for new rows)
-- Note: If there are existing rows, you may need to update them first
-- ALTER TABLE public.applications 
-- ALTER COLUMN birth_date SET NOT NULL,
-- ALTER COLUMN whatsapp SET NOT NULL,
-- ALTER COLUMN city SET NOT NULL,
-- ALTER COLUMN institution SET NOT NULL,
-- ALTER COLUMN course SET NOT NULL,
-- ALTER COLUMN current_period SET NOT NULL,
-- ALTER COLUMN study_shift SET NOT NULL,
-- ALTER COLUMN interest_areas SET NOT NULL,
-- ALTER COLUMN motivation SET NOT NULL,
-- ALTER COLUMN contributions SET NOT NULL,
-- ALTER COLUMN has_experience SET NOT NULL,
-- ALTER COLUMN lgpd_consent SET NOT NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS applications_created_at_idx ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.applications (opportunity_id);

-- ===========================================
-- RLS Policies (if not already created)
-- ===========================================

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow insert from anon" ON public.applications;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.applications;
DROP POLICY IF EXISTS "Users can view own application" ON public.applications;
DROP POLICY IF EXISTS "Users can update own application" ON public.applications;

-- Policy: Allow INSERT for anonymous users (without user_id)
CREATE POLICY "Allow anonymous insert"
ON public.applications
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Policy: Allow INSERT for authenticated users (with their user_id)
CREATE POLICY "Allow authenticated insert"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow SELECT for users to view their own application
CREATE POLICY "Users can view own application"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow UPDATE for users to update their own application
CREATE POLICY "Users can update own application"
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- Admin policies
-- ===========================================

DROP POLICY IF EXISTS "Admins can read all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

CREATE POLICY "Admins can read all applications" ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  );

CREATE POLICY "Admins can update applications" ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  );

-- ===========================================
-- End of Migration
-- ===========================================
