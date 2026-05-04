import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { progressApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import Link from 'next/link';

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    // Récup des stats — si erreur, on affiche des zéros plutôt que crasher
    let stats;
    try {
        stats = await progressApi.getStats('week');
    } catch (err) {
        if (!(err instanceof ApiError)) throw err;
        console.error('Failed to load stats:', err.message);
        stats = {
            total_pages: 0,
            books_to_read: 0,
            books_in_progress: 0,
            books_finished: 0,
        };
    }

    return (
        <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
            <section>
                <h1 className="font-editorial text-3xl text-ink-900 dark:text-paper-100">
                    Bonjour
                </h1>
                <p className="mt-1 text-ink-600 dark:text-paper-300">
                    Connecté en tant que {user.email}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="À lire" value={stats.books_to_read} />
                <StatCard label="En cours" value={stats.books_in_progress} />
                <StatCard label="Lus" value={stats.books_finished} />
                <StatCard label="Pages cette semaine" value={stats.total_pages} />
            </section>

            <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
                <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl text-ink-900 dark:text-paper-100">
                        Bibliothèque
                    </h3>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/library"
                            className="rounded-md border border-paper-300 px-3 py-1.5 text-sm text-ink-700 transition hover:bg-paper-100 dark:border-ink-700 dark:text-paper-200 dark:hover:bg-ink-900"
                        >
                            Voir tout
                        </Link>
                        <Link
                            href="/library/add"
                            className="rounded-md bg-brick-500 px-3 py-1.5 text-sm font-medium text-paper-50 transition hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                        >
                            + Ajouter
                        </Link>
                    </div>
                </div>
                <p className="mt-3 text-sm text-ink-600 dark:text-paper-300">
                    Retrouve toutes tes lectures organisées par statut.
                </p>
            </section>
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-paper-200 bg-bg-card p-5 dark:border-ink-800">
            <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-paper-400">
                {label}
            </div>
            <div className="mt-2 font-editorial text-3xl text-ink-900 dark:text-paper-100">
                {value}
            </div>
        </div>
    );
}