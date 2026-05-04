'use client';

import { useState, useTransition } from 'react';
import type { ReadingStatus } from '@/lib/api/types';
import { updateEntry } from './actions';
import { toast } from '@/lib/toast';

const STATUSES: Array<{ value: ReadingStatus; label: string }> = [
    { value: 'to_read', label: 'À lire' },
    { value: 'reading', label: 'En cours' },
    { value: 'read', label: 'Lu' },
    { value: 'abandoned', label: 'Abandonné' },
];

interface StatusControlProps {
    entryId: string;
    currentStatus: ReadingStatus;
    currentPage: number;
    pageCount: number | null;
}

export function StatusControl({
    entryId,
    currentStatus,
    currentPage,
    pageCount,
}: StatusControlProps) {
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(currentPage);
    // On garde un état optimiste pour que l'UI réponde instantanément
    const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

    function handleStatusChange(newStatus: ReadingStatus) {
        if (newStatus === optimisticStatus) return;
        setOptimisticStatus(newStatus);

        startTransition(async () => {
            const result = await updateEntry(entryId, { status: newStatus });
            if (result.error) {
                toast.error(result.error);
                setOptimisticStatus(currentStatus);
            } else {
                toast.success('Statut mis à jour');
            }
        });
    }

    function handlePageSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (page === currentPage) return;

        startTransition(async () => {
            const result = await updateEntry(entryId, { current_page: page });
            if (result.error) {
                toast.error(result.error);
                setPage(currentPage);
            } else {
                toast.success(`Page ${page} enregistrée`);
            }
        });
    }

    return (
        <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
            <h3 className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                Statut & progression
            </h3>

            {/* Sélecteur de statut */}
            <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                    const isActive = optimisticStatus === s.value;
                    return (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => handleStatusChange(s.value)}
                            disabled={isPending}
                            className={
                                isActive
                                    ? 'rounded-full bg-brick-500 px-4 py-1.5 text-sm font-medium text-paper-50 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950'
                                    : 'rounded-full border border-paper-200 px-4 py-1.5 text-sm text-ink-700 transition hover:bg-paper-100 disabled:opacity-60 dark:border-ink-700 dark:text-paper-200 dark:hover:bg-ink-900'
                            }
                        >
                            {s.label}
                        </button>
                    );
                })}
            </div>

            {/* Page courante (uniquement si on a un page_count) */}
            {pageCount && (
                <form onSubmit={handlePageSubmit} className="mt-6 flex items-end gap-3">
                    <div className="flex-1 max-w-50">
                        <label
                            htmlFor="current_page"
                            className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                        >
                            Page actuelle
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="current_page"
                                type="number"
                                min={0}
                                max={pageCount}
                                value={page}
                                onChange={(e) => setPage(Number(e.target.value))}
                                className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2 text-ink-900 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100"
                            />
                            <span className="text-sm text-ink-500 dark:text-paper-400">
                                / {pageCount}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isPending || page === currentPage}
                        className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                    >
                        Enregistrer
                    </button>
                </form>
            )}
        </section>
    );
}