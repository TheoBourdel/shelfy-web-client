'use client';

import { useState, useTransition } from 'react';
import { toast } from '@/lib/toast';
import { changePassword } from './actions';

export function ChangePasswordForm() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isPending, startTransition] = useTransition();

    const passwordMatches = password === confirm;
    const isValid =
        password.length >= 8 && confirm.length >= 8 && passwordMatches;

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isValid) {
            if (!passwordMatches) toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        startTransition(async () => {
            const result = await changePassword(password);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success('Mot de passe changé');
            setPassword('');
            setConfirm('');
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="new_password"
                    className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Nouveau mot de passe
                </label>
                <input
                    id="new_password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100"
                />
                <p className="mt-1 text-xs text-ink-500 dark:text-paper-400">
                    8 caractères minimum.
                </p>
            </div>

            <div>
                <label
                    htmlFor="confirm_password"
                    className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Confirmer
                </label>
                <input
                    id="confirm_password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || !isValid}
                    className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    {isPending ? 'Changement...' : 'Changer le mot de passe'}
                </button>
            </div>
        </form>
    );
}