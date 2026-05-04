'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { ConfirmModal } from '@/components/confirm-modal';
import { deleteEntry } from './actions';

interface DangerZoneProps {
    entryId: string;
    bookTitle: string;
}

export function DangerZone({ entryId, bookTitle }: DangerZoneProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [, startTransition] = useTransition();

    function handleConfirm() {
        return new Promise<void>((resolve) => {
            startTransition(async () => {
                const result = await deleteEntry(entryId);
                if (result?.error) {
                    toast.error(result.error);
                    setOpen(false);
                    resolve();
                    return;
                }
                toast.success('Livre retiré de ta bibliothèque');
                setOpen(false);
                router.push('/library');
                resolve();
            });
        });
    }

    return (
        <section className="mt-16 border-t border-paper-200 pt-8 dark:border-ink-800">
            <h3 className="font-editorial text-lg text-ink-900 dark:text-paper-100">
                Zone de danger
            </h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-paper-300">
                Retire ce livre de ta bibliothèque. Cette action est définitive.
            </p>

            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-3 rounded-md border border-brick-500 px-4 py-2 text-sm font-medium text-brick-500 transition hover:bg-brick-500 hover:text-paper-50 dark:border-brick-300 dark:text-brick-300 dark:hover:bg-brick-300 dark:hover:text-ink-950"
            >
                Retirer de la bibliothèque
            </button>

            <ConfirmModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
                title="Retirer ce livre ?"
                description={`"${bookTitle}" sera retiré de ta bibliothèque. Tes notes, ton rating et l'historique de tes sessions de lecture seront supprimés. Cette action est définitive.`}
                confirmLabel="Retirer"
                cancelLabel="Annuler"
                variant="danger"
            />
        </section>
    );
}