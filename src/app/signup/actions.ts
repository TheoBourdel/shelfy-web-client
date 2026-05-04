'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

const signupSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe trop court (8 caractères minimum)'),
});

export async function signUp(formData: FormData) {
    const parsed = signupSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return {
            error: parsed.error.issues[0]?.message ?? 'Données invalides',
        };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        ...parsed.data,
        options: {
            emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        if (error.message.includes('already registered')) {
            return { error: 'Cet email est déjà utilisé' };
        }
        return { error: error.message };
    }

    // Si Supabase a créé le user mais pas de session → confirmation email requise
    const requiresEmailConfirmation = data.user !== null && data.session === null;

    return { error: null, requiresEmailConfirmation };
}