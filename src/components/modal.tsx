'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    /**
     * Si `false`, l'utilisateur ne peut PAS fermer en cliquant sur le backdrop
     * ou en pressant Escape (utile pendant une opération en cours).
     */
    dismissable?: boolean;
}

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    dismissable = true,
}: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    // Sync entre la prop `open` et l'état natif du <dialog>
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // Intercepte la fermeture native (Escape) pour mettre à jour l'état React
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        const handleClose = () => onClose();
        const handleCancel = (e: Event) => {
            if (!dismissable) {
                e.preventDefault();
            }
        };

        dialog.addEventListener('close', handleClose);
        dialog.addEventListener('cancel', handleCancel);

        return () => {
            dialog.removeEventListener('close', handleClose);
            dialog.removeEventListener('cancel', handleCancel);
        };
    }, [onClose, dismissable]);

    // Click sur le backdrop = fermeture (si dismissable)
    function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
        if (!dismissable) return;
        if (e.target === ref.current) {
            onClose();
        }
    }

    return (
        <dialog
            ref={ref}
            onClick={handleBackdropClick}
            aria-labelledby="modal-title"
            aria-describedby={description ? 'modal-description' : undefined}
            className="m-auto w-full max-w-md rounded-xl border border-paper-200 bg-bg-card p-0 text-ink-900 shadow-xl backdrop:bg-ink-950/60 dark:border-ink-800 dark:text-paper-100 dark:backdrop:bg-ink-950/80"
        >
            {/* Wrapper interne pour empêcher la fermeture au clic intérieur */}
            <div onClick={(e) => e.stopPropagation()} className="p-6">
                <div>
                    <h2
                        id="modal-title"
                        className="font-editorial text-xl text-ink-900 dark:text-paper-100"
                    >
                        {title}
                    </h2>
                    {description && (
                        <p
                            id="modal-description"
                            className="mt-1.5 text-sm text-ink-600 dark:text-paper-300"
                        >
                            {description}
                        </p>
                    )}
                </div>

                <div className="mt-5">{children}</div>
            </div>
        </dialog>
    );
}