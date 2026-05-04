import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { libraryApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import { LibraryFilters } from './library-filters';
import { LibraryEntryCard } from '@/components/library-entry-card';
import type { ReadingStatus } from '@/lib/api/types';

const VALID_STATUSES: ReadingStatus[] = [
    'to_read',
    'reading',
    'read',
    'abandoned',
];

export default async function LibraryPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const params = await searchParams;
    const statusFilter = VALID_STATUSES.includes(params.status as ReadingStatus)
        ? (params.status as ReadingStatus)
        : undefined;

    let entries;
    let countsData;
    try {
        [entries, countsData] = await Promise.all([
            libraryApi.list({ status: statusFilter, limit: 100 }),
            libraryApi.counts(),
        ]);
    } catch (err) {
        if (!(err instanceof ApiError)) throw err;
        return (
            <ErrorState message={`Erreur lors du chargement : ${err.message}`} />
        );
    }

    const counts: Record<string, number> = {
        all: countsData.total,
        ...countsData.counts,
    };

    return (
        <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-editorial text-3xl text-ink-900 dark:text-paper-100">
                        Ma bibliothèque
                    </h1>
                    <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">
                        {counts.all === 0
                            ? "Tu n'as pas encore de livre."
                            : `${counts.all} livre${counts.all > 1 ? 's' : ''} dans ta bibliothèque.`}
                    </p>
                </div>
                <Link
                    href="/library/add"
                    className="rounded-md bg-brick-500 px-3 py-1.5 text-sm font-medium text-paper-50 transition hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    + Ajouter
                </Link>
            </div>

            {counts.all > 0 && <LibraryFilters counts={counts} />}

            {entries.entries.length === 0 ? (
                <EmptyState hasFilter={!!statusFilter} />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {entries.entries.map((entry) => (
                        <LibraryEntryCard key={entry.id} entry={entry} />
                    ))}
                </div>
            )}
        </main>
    );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
    return (
        <div className="rounded-xl border border-dashed border-paper-300 bg-bg-card p-10 text-center dark:border-ink-700">
            <p className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                {hasFilter ? 'Aucun livre dans cette catégorie' : 'Bibliothèque vide'}
            </p>
            <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">
                {hasFilter
                    ? 'Change de filtre ou ajoute un nouveau livre.'
                    : 'Commence par ajouter ton premier livre.'}
            </p>
            {!hasFilter && (
                <Link
                    href="/library/add"
                    className="mt-4 inline-block rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    Ajouter un livre
                </Link>
            )}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="rounded-lg border border-brick-100 bg-brick-50 p-6 text-sm text-brick-700 dark:border-ink-700 dark:bg-ink-900 dark:text-brick-300">
                {message}
            </div>
        </main>
    );
}