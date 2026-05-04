import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { profileApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import { getSidebarState } from '@/lib/sidebar';
import { Sidebar } from '@/components/sidebar';

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    // Récup du profil — si erreur, on tombe back sur l'email
    let displayName: string | null = null;
    try {
        const profile = await profileApi.getMe();
        displayName = profile.display_name;
    } catch (err) {
        if (!(err instanceof ApiError)) throw err;
        // Silent fail, la sidebar utilisera l'email
    }

    const sidebarState = await getSidebarState();
    const collapsed = sidebarState === 'collapsed';

    return (
        <div className="min-h-screen">
            <Sidebar
                initialState={sidebarState}
                userLabel={displayName ?? user.email ?? ''}
            />
            <div
                className={`transition-[padding] duration-200 ease-out ${collapsed ? 'pl-16' : 'pl-64'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}