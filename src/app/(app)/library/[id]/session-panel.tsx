'use client';

import { useState, useTransition } from 'react';
import { logReadingSession } from './actions';
import type { ReadingSession } from '@/lib/api/types';
import { toast } from '@/lib/toast';

interface SessionPanelProps {
    entryId: string;
    currentPage: number;
    pageCount: number | null;
    recentSessions: ReadingSession[];
}

export function SessionPanel({
    entryId,
    currentPage,
    pageCount,
    recentSessions,
}: SessionPanelProps) {
    const [pages, setPages] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const pagesNum = Number(pages);
    const durationNum = duration ? Number(duration) : undefined;
    const isValid = pages !== '' && Number.isInteger(pagesNum) && pagesNum > 0;

    // Validation côté UI : ne pas dépasser le total de pages
    const wouldExceed = pageCount && currentPage + pagesNum > pageCount;

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isValid || wouldExceed) return;

        startTransition(async () => {
            const result = await logReadingSession(entryId, {
                pages_read: pagesNum,
                duration_minutes: durationNum,
            });
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success(
                `Session enregistrée. Tu es maintenant page ${result.newCurrentPage}.`,
            );
            setPages('');
            setDuration('');
        });
    }

    return (
        <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
            <h3 className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                Session de lecture
            </h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-paper-300">
                Note ce que tu viens de lire pour suivre ta progression.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div>
                    <label
                        htmlFor="pages_read"
                        className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                    >
                        Pages lues
                    </label>
                    <input
                        id="pages_read"
                        type="number"
                        min={1}
                        max={pageCount ? pageCount - currentPage : undefined}
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        placeholder="30"
                        className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="duration"
                        className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                    >
                        Durée (minutes){' '}
                        <span className="text-xs font-normal text-ink-500">— optionnel</span>
                    </label>
                    <input
                        id="duration"
                        type="number"
                        min={1}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="25"
                        className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending || !isValid || !!wouldExceed}
                    className="h-10.5 rounded-md bg-brick-500 px-4 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    {isPending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </form>

            {wouldExceed && (
                <p className="mt-3 text-sm text-brick-700 dark:text-brick-300">
                    Cela dépasserait la fin du livre ({pageCount} pages au total).
                </p>
            )}

            {/* Historique récent */}
            {recentSessions.length > 0 && (
                <div className="mt-8 border-t border-paper-200 pt-6 dark:border-ink-800">
                    <h4 className="text-sm font-medium text-ink-800 dark:text-paper-200">
                        Sessions récentes
                    </h4>
                    <ul className="mt-3 space-y-2">
                        {recentSessions.map((session) => (
                            <SessionRow key={session.id} session={session} />
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function SessionRow({ session }: { session: ReadingSession }) {
    const date = new Date(session.logged_at);
    const dateLabel = formatRelative(date);

    return (
        <li className="flex items-center justify-between rounded-lg border border-paper-200 bg-paper-50 px-3 py-2 text-sm dark:border-ink-800 dark:bg-ink-900">
            <div className="flex items-baseline gap-3">
                <span className="font-medium text-ink-900 dark:text-paper-100">
                    {session.pages_read} {session.pages_read > 1 ? 'pages' : 'page'}
                </span>
                {session.duration_minutes && (
                    <span className="text-xs text-ink-500 dark:text-paper-400">
                        en {session.duration_minutes} min
                    </span>
                )}
            </div>
            <span className="text-xs text-ink-500 dark:text-paper-400">
                {dateLabel}
            </span>
        </li>
    );
}

/**
 * Formatte une date en relatif simple :
 * "il y a 2h", "hier", "il y a 3 jours", sinon date courte.
 */
function formatRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    const diffH = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    if (diffH < 24) return `il y a ${diffH}h`;
    if (diffDays === 1) return 'hier';
    if (diffDays < 7) return `il y a ${diffDays} jours`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
    });
}