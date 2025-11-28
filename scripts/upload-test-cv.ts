/**
 * Script to upload a test CV PDF for the test application
 * Run with: npx tsx scripts/upload-test-cv.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Simple PDF content (minimal valid PDF)
const createSimplePDF = () => {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
50 700 Td
(CURRICULO - Maria Silva Santos) Tj
0 -40 Td
/F1 14 Tf
(Email: maria.santos@email.com) Tj
0 -25 Td
(Telefone: 61 98765-4321) Tj
0 -25 Td
(Formacao: Ciencia da Computacao - UnB) Tj
0 -25 Td
(Habilidades: JavaScript, React, Python) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000518 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
595
%%EOF`;
  return Buffer.from(content, 'utf-8');
};

async function uploadTestCV() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Get the test application
  const { data: app, error: fetchError } = await supabase
    .from('applications')
    .select('id')
    .eq('email', 'maria.santos@email.com')
    .single();

  if (fetchError || !app) {
    console.error('Test application not found');
    process.exit(1);
  }

  console.log('Uploading CV for application:', app.id);

  // Create PDF content
  const pdfContent = createSimplePDF();
  const fileName = `${app.id}/cv_maria_silva.pdf`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('cvs')
    .upload(fileName, pdfContent, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    process.exit(1);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('cvs')
    .getPublicUrl(fileName);

  // Update application with CV URL
  const { error: updateError } = await supabase
    .from('applications')
    .update({ cv_url: urlData.publicUrl })
    .eq('id', app.id);

  if (updateError) {
    console.error('Update error:', updateError.message);
    process.exit(1);
  }

  console.log('✅ CV uploaded successfully!');
  console.log('   URL:', urlData.publicUrl);
}

uploadTestCV();
