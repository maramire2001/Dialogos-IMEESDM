import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build time to prevent errors
// The real values are injected at runtime via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está configurada o es inválida.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
