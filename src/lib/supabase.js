import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cliente público (para el frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente con privilegios de servicio (solo para el backend)
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null
