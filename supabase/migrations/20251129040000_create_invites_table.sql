-- Create invites tracking table
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  invited_by_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Index for quick lookups
CREATE INDEX idx_invites_email ON invites(email);
CREATE INDEX idx_invites_invited_by ON invites(invited_by);
CREATE INDEX idx_invites_status ON invites(status);

-- Enable RLS
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all invites
CREATE POLICY "Admins can read all invites" ON invites
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('carlosdenner@gmail.com', 'admin@gigacandanga.net.br')
  );

-- Policy: Service role can insert/update invites (for edge function)
CREATE POLICY "Service role can manage invites" ON invites
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add was_invited column to applications table to track if user came from invite
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS was_invited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invite_id UUID REFERENCES invites(id);

-- Function to mark invite as accepted when user signs up
CREATE OR REPLACE FUNCTION handle_invite_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update any pending invites for this email
  UPDATE invites 
  SET 
    status = 'accepted',
    accepted_at = now(),
    accepted_by = NEW.id
  WHERE 
    email = NEW.email 
    AND status = 'pending'
    AND expires_at > now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run when user confirms email
CREATE OR REPLACE TRIGGER on_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_invite_acceptance();

-- Comment for documentation
COMMENT ON TABLE invites IS 'Tracks user invitations sent by admins';
COMMENT ON COLUMN invites.status IS 'pending = awaiting signup, accepted = user signed up, expired = invite expired';
