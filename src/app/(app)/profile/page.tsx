import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { profileApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    let profile;
    try {
        profile = await profileApi.getMe();
    } catch (err) {
        if (!(err instanceof ApiError)) throw err;
        return (
            <main className="mx-auto max-w-2xl px-6 py-10">
                <div className="rounded-lg border border-brick-100 bg-brick-50 p-4 text-sm text-brick-700 dark:border-ink-700 dark:bg-ink-900 dark:text-brick-300">
                    Erreur lors du chargement du profil : {err.message}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-2xl px-6 py-10">
            <div className="mb-8">
                <h1 className="font-editorial text-3xl text-ink-900 dark:text-paper-100">
                    Profil
                </h1>
                <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">
                    Gère tes informations personnelles.
                </p>
            </div>

            <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
                <ProfileForm
                    initialDisplayName={profile.display_name ?? ''}
                    email={profile.email ?? ''}
                />
            </section>
        </main>
    );
}