// Admin User Management Edge Function
// Confirms email and/or sets password for users

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Get email and optional password from request
    const { email, password } = await req.json()
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Get user by email
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
    
    if (listError) {
      return new Response(
        JSON.stringify({ error: listError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const user = users.find(u => u.email === email)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: `User not found: ${email}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build update object
    const updateData: { email_confirm?: boolean; password?: string } = {}
    
    if (!user.email_confirmed_at) {
      updateData.email_confirm = true
    }
    
    if (password) {
      updateData.password = password
    }

    // Update user
    const { data, error } = await adminClient.auth.admin.updateUserById(user.id, updateData)

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const actions = []
    if (updateData.email_confirm) actions.push('email confirmed')
    if (updateData.password) actions.push('password updated')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${email}: ${actions.length > 0 ? actions.join(', ') : 'no changes needed'}`,
        user_id: data.user.id,
        email_confirmed_at: data.user.email_confirmed_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
