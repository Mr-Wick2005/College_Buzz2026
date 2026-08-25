import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "[Supabase Client] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment variables.",
  )
}

// Singleton — reuse existing client across HMR reloads to avoid multiple GoTrueClient instances
const _key = "__college_buzz_supabase_client__"

declare global {
  interface Window {
    __college_buzz_supabase_client__?: ReturnType<typeof createClient>
  }
}

export const supabase =
  (typeof window !== "undefined" &&
    (window[_key] ||
      (window[_key] = createClient(supabaseUrl, supabasePublishableKey)))) ||
  createClient(supabaseUrl, supabasePublishableKey)

export default supabase
