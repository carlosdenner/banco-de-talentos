/**
 * Create the CVs storage bucket
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function createBucket() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('Updating CVs bucket to be public...');

  // Try to update existing bucket to be public
  const { data: updateData, error: updateError } = await supabase.storage.updateBucket('cvs', {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf'],
  });

  if (updateError) {
    console.log('Update error (trying to create):', updateError.message);
    
    // Try to create if doesn't exist
    const { data, error } = await supabase.storage.createBucket('cvs', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['application/pdf'],
    });

    if (error) {
      console.error('Create error:', error.message);
    } else {
      console.log('✅ Bucket created:', data);
    }
  } else {
    console.log('✅ Bucket updated to public:', updateData);
  }
}

createBucket();
