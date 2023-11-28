import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseKey) throw new Error('Missing env vars supabase client');

export const supabase = createClient(supabaseUrl, supabaseKey);