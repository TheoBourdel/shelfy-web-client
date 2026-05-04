'use client';

import { useState } from 'react';
import { Modal } from './modal';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    /**
     * 'danger' pour les actions destructives (rouge), 'primary' sinon
     */
    variant?: 'danger' | 'primary';
    /**
     * Si défini, l'utilisateur doit taper exactement cette chaîne pour activer
     * le bouton de confirmation (ex: son email pour supprimer le compte).
     */
    confirmationText?: string;
    confirmationLabel?: string;
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Annuler',
    variant = 'danger',
    confirmationText,
    confirmationLabel,
}: ConfirmModalProps) {
    const [isPending, setPending] = useState(false);
    const [typed, setTyped] = useState('');

    const requiresTyping = !!confirmationText;
    const typingValid = !requiresTyping || typed === confirmationText;
    const canConfirm = typingValid && !isPending;

    async function handleConfirm() {
        setPending(true);
        try {
            await onConfirm();
        } finally {
            setPending(false);
            setTyped('');
        }
    }

    function handleClose() {
        if (isPending) return;
        setTyped('');
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={title}
            description={description}
            dismissable={!isPending}
        >
            {requiresTyping && (
                <div className="mb-4">
                    <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-paper-200">
                        {confirmationLabel ?? `Tape "${confirmationText}" pour confirmer`}
                    </label>
                    <input
                        type="text"
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        autoComplete="off"
                        disabled={isPending}
                        className="w-full rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 disabled:opacity-60 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100"
                        placeholder={confirmationText}
                    />
                </div>
            )}

            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="rounded-md border border-paper-300 px-4 py-2 text-sm text-ink-700 transition hover:bg-paper-100 disabled:opacity-60 dark:border-ink-700 dark:text-paper-200 dark:hover:bg-ink-900"
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className={
                        variant === 'danger'
                            ? 'rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100'
                            : 'rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-ink-700 disabled:opacity-60 dark:bg-paper-100 dark:text-ink-900 dark:hover:bg-paper-200'
                    }
                >
                    {isPending ? 'En cours...' : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}