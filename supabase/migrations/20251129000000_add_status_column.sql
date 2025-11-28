-- Add status column to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected'));

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Add RLS policy for admin to read all applications
-- Note: In production, you might want to use a more robust admin check
CREATE POLICY "Admins can read all applications" ON applications
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('carlosdenner@gmail.com')
  );

-- Add RLS policy for admin to update application status
CREATE POLICY "Admins can update applications" ON applications
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('carlosdenner@gmail.com')
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('carlosdenner@gmail.com')
  );
