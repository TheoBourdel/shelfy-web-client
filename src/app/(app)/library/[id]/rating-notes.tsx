'use client';

import { useState, useTransition } from 'react';
import { updateEntry } from './actions';
import { toast } from '@/lib/toast';

interface RatingNotesProps {
    entryId: string;
    currentRating: number | null;
    currentNotes: string | null;
}

export function RatingNotes({
    entryId,
    currentRating,
    currentNotes,
}: RatingNotesProps) {
    const [isPending, startTransition] = useTransition();

    // État optimiste pour le rating (clic instantané)
    const [optimisticRating, setOptimisticRating] = useState(currentRating);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    // État local pour les notes (pas optimiste, sauvegarde explicite)
    const [notes, setNotes] = useState(currentNotes ?? '');
    const notesChanged = notes !== (currentNotes ?? '');

    function handleRating(newRating: number) {
        const next = optimisticRating === newRating ? null : newRating;
        setOptimisticRating(next);

        startTransition(async () => {
            const result = await updateEntry(entryId, { rating: next });
            if (result.error) {
                toast.error(result.error);
                setOptimisticRating(currentRating);
            } else {
                toast.success(next === null ? 'Note retirée' : `Note enregistrée`);
            }
        });
    }

    function handleNotesSave() {
        const trimmed = notes.trim();
        const value = trimmed === '' ? null : trimmed;

        startTransition(async () => {
            const result = await updateEntry(entryId, { notes: value });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Notes enregistrées');
            }
        });
    }

    const displayRating = hoverRating ?? optimisticRating ?? 0;

    return (
        <section className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
            <h3 className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                Notes & avis
            </h3>

            {/* Rating */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-ink-800 dark:text-paper-200">
                    Note
                </label>
                <div
                    className="mt-2 flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(null)}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleRating(value)}
                            onMouseEnter={() => setHoverRating(value)}
                            disabled={isPending}
                            className="text-2xl transition disabled:opacity-60"
                            aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
                        >
                            <span
                                className={
                                    value <= displayRating
                                        ? 'text-brick-500 dark:text-brick-300'
                                        : 'text-paper-300 dark:text-ink-700'
                                }
                            >
                                ★
                            </span>
                        </button>
                    ))}
                    {optimisticRating !== null && (
                        <button
                            type="button"
                            onClick={() => handleRating(optimisticRating)}
                            disabled={isPending}
                            className="ml-3 text-xs text-ink-500 hover:text-ink-700 dark:text-paper-400 dark:hover:text-paper-200"
                        >
                            Retirer
                        </button>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
                <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Notes personnelles
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    maxLength={5000}
                    placeholder="Ce que tu as pensé du livre, citations marquantes, ressentis..."
                    className="mt-2 w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400"
                />
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-ink-500 dark:text-paper-400">
                        {notes.length} / 5000
                    </span>
                    <button
                        type="button"
                        onClick={handleNotesSave}
                        disabled={isPending || !notesChanged}
                        className="rounded-md bg-brick-500 px-3 py-1.5 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                    >
                        {isPending ? 'Sauvegarde...' : 'Enregistrer les notes'}
                    </button>
                </div>
            </div>
        </section>
    );
}