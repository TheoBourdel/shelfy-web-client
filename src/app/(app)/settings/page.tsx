import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { ChangePasswordForm } from './change-password-form';
import { DeleteAccountSection } from './delete-account-section';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    return (
        <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
            <div>
                <h1 className="font-editorial text-3xl text-ink-900 dark:text-paper-100">
                    Paramètres
                </h1>
                <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">
                    Gère ton compte et tes préférences.
                </p>
            </div>

            <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
                <h2 className="font-editorial text-xl text-ink-900 dark:text-paper-100">
                    Changer le mot de passe
                </h2>
                <p className="mt-1 text-sm text-ink-600 dark:text-paper-300">
                    Tu seras déconnecté des autres appareils.
                </p>
                <div className="mt-4">
                    <ChangePasswordForm />
                </div>
            </section>

            <DeleteAccountSection userEmail={user.email ?? ''} />
        </main>
    );
}