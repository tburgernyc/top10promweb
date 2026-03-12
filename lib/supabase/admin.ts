'use cache'

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Service role client — server-only. Never expose to the browser.
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    console.warn('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY missing — admin features disabled')
    return null
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
