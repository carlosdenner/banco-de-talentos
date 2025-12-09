import 'dotenv/config';

const PROJECT_REF = 'zppltubgadwwahsnammj';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const sql = `
-- Fix opportunities table schema
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS requirements text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS benefits text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS location text DEFAULT 'Brasília - DF';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS work_model text DEFAULT 'Híbrido';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS weekly_hours integer DEFAULT 20;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS monthly_stipend decimal(10,2);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS interest_areas text[] DEFAULT '{}';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS max_applications integer;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_dates ON opportunities(start_date, end_date);

-- Add opportunity reference to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS opportunity_id uuid REFERENCES opportunities(id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON applications(opportunity_id);

-- Enable RLS on opportunities
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active opportunities" ON opportunities;
DROP POLICY IF EXISTS "Admins can manage opportunities" ON opportunities;

-- Everyone can read active opportunities
CREATE POLICY "Anyone can read active opportunities" ON opportunities
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything with opportunities
CREATE POLICY "Admins can manage opportunities" ON opportunities
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'carlosdenner@unb.br',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'carlosdenner@unb.br',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  );

-- Fix applications RLS policies
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;

CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON applications
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'carlosdenner@gmail.com',
      'carlosdenner@unb.br',
      'isadora.lima@gigacandanga.net.br',
      'paulo.angelo@gigacandanga.net.br',
      'andre.drummond@gigacandanga.net.br',
      'rh@gigacandanga.net.br'
    )
  );
`;

async function runSQL() {
  if (!ACCESS_TOKEN) {
    console.error('Missing SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log('Running schema fix...');
  
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Error:', response.status, text);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Success:', result);
}

runSQL();
