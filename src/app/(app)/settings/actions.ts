'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function changePassword(newPassword: string) {
    if (newPassword.length < 8) {
        return { error: 'Le mot de passe doit faire au moins 8 caractères' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

/**
 * Supprime le compte de l'utilisateur courant.
 * Note : auth.users.id a un ON DELETE CASCADE vers profiles, library_entries, etc.
 * → toutes les données utilisateur sont supprimées en cascade.
 */
export async function deleteAccount() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non authentifié' };
    }

    // Supprimer via l'admin API (nécessite service_role).
    // Comme ce code tourne côté serveur Next, on a besoin d'un client admin.
    // → on délègue au backend Express via un endpoint dédié.
    // Pour le MVP, on passe par une requête HTTP au back qui fera le boulot.
    const { getAccessToken } = await import('@/lib/supabase/auth');
    const token = await getAccessToken();
    const { env } = await import('@/lib/env');

    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/profile/me`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return { error: 'Impossible de supprimer le compte' };
    }

    // Sign out + redirect
    await supabase.auth.signOut();
    redirect('/');
}