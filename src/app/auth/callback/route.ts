import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Endpoint que Supabase appelle après que l'utilisateur clique sur le lien
 * de confirmation reçu par email.
 * Échange le code contre une session puis redirige vers le dashboard.
 */
export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Erreur ou code manquant → retour login avec message
    return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Lien invalide ou expiré')}`,
    );
}