-- Update RLS policies with new admin emails

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can read all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;

-- Recreate with updated admin list
CREATE POLICY "Admins can read all applications" ON applications
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

CREATE POLICY "Admins can update applications" ON applications
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
