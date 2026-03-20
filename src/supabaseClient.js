import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yrjmgtqnlyrseskhstld.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyam1ndHFubHlyc2Vza2hzdGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTU1NjYsImV4cCI6MjA4ODk5MTU2Nn0.vVVKGU8n0oJ4ZIKpEtlCTvYIkwV06cTEBv6OGKP1h_E"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);