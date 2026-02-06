
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend ops

if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon key. This may cause RLS permission errors.');
}

// Fallback to anon key if service key is missing, effectively same as original but allows upgrade
const keyToUse = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseAdminClient;

try {
    if (supabaseUrl && keyToUse) {
        console.log('Initializing Supabase Admin Client in', process.env.NODE_ENV);
        supabaseAdminClient = createClient(supabaseUrl, keyToUse);
    } else {
        console.warn('Supabase credentials missing during initialization of supabase-admin.');
        // Return a dummy object or null, but don't crash the module import
        supabaseAdminClient = {
            from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ error: 'Supabase not initialized' }) }) }), insert: async () => ({ error: 'Supabase not initialized' }) })
        };
    }
} catch (e) {
    console.error('Failed to initialize Supabase Admin client:', e);
    supabaseAdminClient = null;
}

export const supabaseAdmin = supabaseAdminClient;
