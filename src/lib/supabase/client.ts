import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';

/**
 * Client Supabase pour les Client Components ('use client').
 * À utiliser dans les forms de login, les hooks, etc.
 */
export function createClient() {
    return createBrowserClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
}