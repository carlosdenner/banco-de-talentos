/**
 * Script to create a test application for testing the admin panel
 * Run with: npx tsx scripts/seed-test-application.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function seedTestApplication() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables:');
    console.error('- VITE_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('Creating test application...');

  const { data, error } = await supabase
    .from('applications')
    .insert({
      full_name: 'Maria Silva Santos',
      birth_date: '2001-05-20',
      email: 'maria.santos@email.com',
      whatsapp: '61987654321',
      city: 'Brasília - DF',
      institution: 'Universidade de Brasília',
      course: 'Ciência da Computação',
      current_period: '5º',
      study_shift: 'Noturno',
      interest_areas: ['Tecnologia da Informação', 'Desenvolvimento de Software'],
      motivation: 'Busco uma oportunidade para aplicar meus conhecimentos em projetos reais e desenvolver novas habilidades.',
      contributions: 'Tenho experiência com JavaScript, React e Python. Gosto de trabalhar em equipe e aprender coisas novas.',
      tools: 'JavaScript, TypeScript, React, Python, Git, VS Code',
      has_experience: true,
      experience_type: 'Projeto acadêmico',
      experience_org: 'UnB - Laboratório de Sistemas',
      experience_period: '03/2024 - 06/2024',
      experience_activities: 'Desenvolvimento de sistema web para gestão de laboratórios',
      experience_learnings: 'Aprendi sobre metodologias ágeis, trabalho em equipe e desenvolvimento web fullstack',
      how_did_you_hear: 'Indicação de amigo',
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error.message);
    process.exit(1);
  }

  console.log('✅ Test application created successfully!');
  console.log('   Name:', data.full_name);
  console.log('   Email:', data.email);
  console.log('   ID:', data.id);
}

seedTestApplication();
