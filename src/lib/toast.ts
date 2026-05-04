'use client';

import { toast } from 'sonner';

/**
 * Affiche un toast en fonction du résultat d'une Server Action
 * qui retourne { success } ou { error }.
 */
export function toastResult(
    result: { success?: boolean; error?: string } | undefined,
    successMessage: string,
    errorPrefix?: string,
): boolean {
    if (!result) {
        toast.error('Une erreur est survenue');
        return false;
    }
    if (result.error) {
        toast.error(errorPrefix ? `${errorPrefix}: ${result.error}` : result.error);
        return false;
    }
    if (result.success) {
        toast.success(successMessage);
        return true;
    }
    return false;
}

export { toast };