'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});

export async function signIn(formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return {
            error: parsed.error.issues[0]?.message ?? 'Données invalides',
        };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        return { error: 'Email ou mot de passe incorrect' };
    }

    // Pas de redirect ici — on retourne success et le client gère la redirection
    // (pour avoir un flow plus prévisible avec useTransition)
    return { error: null };
}