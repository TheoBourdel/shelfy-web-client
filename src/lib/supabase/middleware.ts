import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '../env';

/**
 * Met à jour la session Supabase à chaque requête.
 * - Refresh le JWT s'il va bientôt expirer
 * - Propage les nouveaux cookies à la réponse
 * - Permet aux Server Components de toujours avoir une session fraîche
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // 1. Mettre à jour les cookies de la request (pour les RSC qui suivent)
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    // 2. Recréer la response avec la request mise à jour
                    supabaseResponse = NextResponse.next({ request });
                    // 3. Mettre à jour les cookies de la response (pour le navigateur)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // ⚠️ CRITIQUE : ne JAMAIS retirer cet appel, ne JAMAIS rien mettre entre
    // createServerClient et getUser. C'est ce qui déclenche le refresh du JWT.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protection des routes : redirige vers /login si non authentifié sur des routes privées
    const pathname = request.nextUrl.pathname;
    const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/auth');

    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}