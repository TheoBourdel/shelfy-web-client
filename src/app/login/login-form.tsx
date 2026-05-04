'use client';

import { use, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { signIn } from './actions';

export function LoginForm({
    searchParamsPromise,
}: {
    searchParamsPromise: Promise<{ redirect?: string; error?: string }>;
}) {
    const searchParams = use(searchParamsPromise);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Si on arrive ici avec un ?error= dans l'URL (depuis le callback), on le toaste
    useState(() => {
        if (searchParams.error) {
            toast.error(searchParams.error);
        }
    });

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await signIn(formData);
            if (result?.error) {
                toast.error(result.error);
                return;
            }
            toast.success('Connexion réussie');
            router.push(searchParams.redirect ?? '/dashboard');
            router.refresh();
        });
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400 dark:focus:border-brick-300"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200"
                >
                    Mot de passe
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400 dark:focus:border-brick-300"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-brick-500 px-4 py-2.5 font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
            >
                {isPending ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    );
}