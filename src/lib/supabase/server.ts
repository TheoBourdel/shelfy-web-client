import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '../env';

/**
 * Client Supabase pour Server Components, Server Actions, Route Handlers.
 * Lit la session depuis les cookies HTTP-only du request courant.
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        );
                    } catch {
                        // Le `setAll` peut être appelé depuis un Server Component, où
                        // les cookies ne sont pas modifiables. Le middleware s'occupera
                        // du refresh, donc on peut ignorer cette erreur.
                    }
                },
            },
        },
    );
}