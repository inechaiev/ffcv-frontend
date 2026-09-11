import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Read-only Supabase client for public server-side data fetching.
 * No auth/session handling is needed because the schedule is public and
 * the anon key only has read access via RLS.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  )
}
