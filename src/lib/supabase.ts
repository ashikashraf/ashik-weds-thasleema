import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ||
  "https://tmlltbcypqidyhigpycc.supabase.co";

export const SUPABASE_ANON_KEY =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) ||
  "sb_publishable_OrJTgVnAWKV0NfvNLucDhA_LxiSVSYq";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
