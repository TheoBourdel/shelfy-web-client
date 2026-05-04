import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { libraryApi, progressApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import { StatusBadge } from '@/components/status-badge';
import { DangerZone } from './danger-zone';
import { StatusControl } from './status-control';
import { RatingNotes } from './rating-notes';
import { SessionPanel } from './session-panel';

export default async function EntryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const { id } = await params;

    let entry;
    let recentSessions;
    try {
        [entry, recentSessions] = await Promise.all([
            libraryApi.getById(id),
            progressApi.listSessions({ library_entry_id: id, limit: 5 }),
        ]);
    } catch (err) {
        if (err instanceof ApiError && err.statusCode === 404) {
            notFound();
        }
        throw err;
    }

    const { book } = entry;
    const progress =
        book.page_count && book.page_count > 0
            ? Math.min(100, Math.round((entry.current_page / book.page_count) * 100))
            : null;

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <Link
                href="/library"
                className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 dark:text-paper-300 dark:hover:text-paper-100"
            >
                ← Retour à la bibliothèque
            </Link>

            <div className="mx-auto max-w-4xl px-6 py-10">
                <div className="grid gap-8 md:grid-cols-[200px_1fr]">
                    {/* Couverture */}
                    <div>
                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-paper-100 shadow-sm dark:bg-ink-900">
                            {book.cover_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-paper-400 dark:text-ink-600">
                                    <BookIcon />
                                </div>
                            )}
                        </div>

                        {progress !== null && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-ink-600 dark:text-paper-300">
                                    <span>
                                        page {entry.current_page} / {book.page_count}
                                    </span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-200 dark:bg-ink-800">
                                    <div
                                        className="h-full bg-brick-500 transition-all dark:bg-brick-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Métadonnées */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="font-editorial text-3xl leading-tight text-ink-900 dark:text-paper-100">
                                    {book.title}
                                </h1>
                                {book.subtitle && (
                                    <p className="mt-1 font-editorial text-lg text-ink-700 dark:text-paper-200">
                                        {book.subtitle}
                                    </p>
                                )}
                                {book.authors.length > 0 && (
                                    <p className="mt-2 text-base text-ink-600 dark:text-paper-300">
                                        {book.authors.join(', ')}
                                    </p>
                                )}
                            </div>
                            <StatusBadge status={entry.status} />
                        </div>

                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            {book.publisher && (
                                <MetaField label="Éditeur" value={book.publisher} />
                            )}
                            {book.published_date && (
                                <MetaField label="Publié" value={book.published_date} />
                            )}
                            {book.page_count && (
                                <MetaField label="Pages" value={`${book.page_count}`} />
                            )}
                            {book.language && (
                                <MetaField label="Langue" value={book.language.toUpperCase()} />
                            )}
                            {book.isbn13 && (
                                <MetaField
                                    label="ISBN"
                                    value={book.isbn13}
                                    mono
                                />
                            )}
                        </dl>

                        {book.description && (
                            <div className="pt-2">
                                <h2 className="text-xs uppercase tracking-wider text-ink-500 dark:text-paper-400">
                                    Description
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-paper-200">
                                    {book.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sections interactives */}
                <section className="mt-12 space-y-6">
                    <StatusControl
                        entryId={entry.id}
                        currentStatus={entry.status}
                        currentPage={entry.current_page}
                        pageCount={book.page_count}
                    />

                    <SessionPanel
                        entryId={entry.id}
                        currentPage={entry.current_page}
                        pageCount={book.page_count}
                        recentSessions={recentSessions.sessions}
                    />

                    <RatingNotes
                        entryId={entry.id}
                        currentRating={entry.rating}
                        currentNotes={entry.notes}
                    />
                </section>

                {/* Zone de danger */}
                <DangerZone entryId={entry.id} bookTitle={book.title} />

            </div>
        </main>
    );
}

function MetaField({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wider text-ink-500 dark:text-paper-400">
                {label}
            </dt>
            <dd
                className={`mt-0.5 text-ink-800 dark:text-paper-100 ${mono ? 'font-mono text-xs' : ''
                    }`}
            >
                {value}
            </dd>
        </div>
    );
}

function PlaceholderCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-xl border border-dashed border-paper-300 bg-bg-card p-6 dark:border-ink-700">
            <h3 className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                {title}
            </h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">{text}</p>
        </div>
    );
}

function BookIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    );
}