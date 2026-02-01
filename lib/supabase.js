import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing! Check your .env.local file.');
    console.log('URL found:', !!supabaseUrl);
    console.log('Key found:', !!supabaseKey);
}

export const supabase = createClient(
    supabaseUrl || '', 
    supabaseKey || ''
);
