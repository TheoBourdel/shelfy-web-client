'use client';

import { useState, useTransition } from 'react';
import { toast } from '@/lib/toast';
import { ConfirmModal } from '@/components/confirm-modal';
import { deleteAccount } from './actions';

export function DeleteAccountSection({ userEmail }: { userEmail: string }) {
    const [open, setOpen] = useState(false);
    const [, startTransition] = useTransition();

    function handleConfirm() {
        return new Promise<void>((resolve) => {
            startTransition(async () => {
                const result = await deleteAccount();
                // En cas de succès, la Server Action redirige vers '/'.
                // On n'arrive ici que si erreur.
                if (result?.error) {
                    toast.error(result.error);
                }
                setOpen(false);
                resolve();
            });
        });
    }

    return (
        <section className="rounded-xl border border-brick-100 bg-bg-card p-6 dark:border-ink-800">
            <h2 className="font-editorial text-xl text-brick-700 dark:text-brick-300">
                Supprimer mon compte
            </h2>
            <p className="mt-1 text-sm text-ink-600 dark:text-paper-300">
                Cette action est définitive. Toutes tes données (bibliothèque, sessions,
                étagères) seront supprimées immédiatement et ne pourront pas être
                récupérées.
            </p>

            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 rounded-md border border-brick-500 px-4 py-2 text-sm font-medium text-brick-500 transition hover:bg-brick-500 hover:text-paper-50 dark:border-brick-300 dark:text-brick-300 dark:hover:bg-brick-300 dark:hover:text-ink-950"
            >
                Supprimer mon compte
            </button>

            <ConfirmModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
                title="Supprimer ton compte ?"
                description="Toutes tes données seront supprimées immédiatement et de manière définitive : ta bibliothèque, tes étagères, tes sessions de lecture, ton profil. Cette action ne peut pas être annulée."
                confirmLabel="Supprimer mon compte"
                variant="danger"
                confirmationText={userEmail}
                confirmationLabel="Tape ton email pour confirmer"
            />
        </section>
    );
}