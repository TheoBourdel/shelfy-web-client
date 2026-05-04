'use client';

import { useState, useTransition } from 'react';
import { toast } from '@/lib/toast';
import { updateProfile } from './actions';

interface ProfileFormProps {
    initialDisplayName: string;
    email: string;
}

export function ProfileForm({ initialDisplayName, email }: ProfileFormProps) {
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const [savedName, setSavedName] = useState(initialDisplayName);
    const [isPending, startTransition] = useTransition();

    const hasChanges = displayName.trim() !== savedName.trim();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmed = displayName.trim();
        const value = trimmed === '' ? null : trimmed;

        startTransition(async () => {
            const result = await updateProfile({ display_name: value });
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success('Profil mis à jour');
            setSavedName(trimmed);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200">
                    Email
                </label>
                <div className="rounded-lg border border-paper-200 bg-paper-100 px-3 py-2.5 text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-paper-200">
                    {email}
                </div>
                <p className="mt-1.5 text-xs text-ink-500 dark:text-paper-400">
                    Pour changer ton email, va dans Paramètres.
                </p>
            </div>

            <div>
                <label
                    htmlFor="display_name"
                    className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Nom d&apos;affichage
                </label>
                <input
                    id="display_name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    minLength={2}
                    maxLength={50}
                    placeholder="Ton nom ou pseudo"
                    className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400"
                />
                <p className="mt-1.5 text-xs text-ink-500 dark:text-paper-400">
                    Entre 2 et 50 caractères. Laisse vide pour ne pas afficher de nom.
                </p>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || !hasChanges}
                    className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    {isPending ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}