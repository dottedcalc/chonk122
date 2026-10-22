export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Lets the site deploy and render before a Supabase project exists.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
