
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const ensureSupabaseConfigured = () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase mode is active but Supabase environment variables are missing. Check frontend/.env.example.'
    )
  }
}
