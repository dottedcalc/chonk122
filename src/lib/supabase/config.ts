export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// The Vercel Supabase integration may set either key name.
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

// Lets the site deploy and render before a Supabase project exists.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
