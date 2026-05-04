import { createClient } from './server';

/**
 * Récupère l'utilisateur courant côté serveur.
 * À utiliser dans les Server Components et Server Actions.
 * Retourne null si non authentifié.
 */
export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

/**
 * Récupère le JWT courant pour l'envoyer au backend Express.
 */
export async function getAccessToken(): Promise<string | null> {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}