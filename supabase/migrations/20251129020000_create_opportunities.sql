-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  title text NOT NULL,
  description text,
  requirements text,
  benefits text,
  location text DEFAULT 'Brasília - DF',
  work_model text DEFAULT 'Híbrido' CHECK (work_model IN ('Presencial', 'Híbrido', 'Remoto')),
  weekly_hours integer DEFAULT 20,
  monthly_stipend decimal(10,2),
  
  interest_areas text[] DEFAULT '{}',
  
  start_date date,
  end_date date,
  
  is_active boolean DEFAULT true,
  max_applications integer,
  
  created_by uuid REFERENCES auth.users(id)
);

-- Add opportunity reference to applications
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS opportunity_id uuid REFERENCES opportunities(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_dates ON opportunities(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON applications(opportunity_id);

-- Enable RLS
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

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
