-- Add LGPD consent fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS lgpd_consent BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS lgpd_consent_date TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN applications.lgpd_consent IS 'User consent for LGPD data processing';
COMMENT ON COLUMN applications.lgpd_consent_date IS 'Timestamp when user gave LGPD consent';
