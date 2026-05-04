'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { libraryApi, progressApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';
import type { ReadingStatus } from '@/lib/api/types';

/**
 * Met à jour une entrée (status, rating, notes, current_page).
 * Retourne { success } ou { error }.
 */
export async function updateEntry(
    id: string,
    input: {
        status?: ReadingStatus;
        current_page?: number;
        rating?: number | null;
        notes?: string | null;
    },
) {
    try {
        await libraryApi.update(id, input);
        revalidatePath(`/library/${id}`);
        revalidatePath('/library');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (err) {
        if (err instanceof ApiError) return { error: err.message };
        throw err;
    }
}

/**
 * Log une session de lecture pour cette entrée.
 */
export async function logReadingSession(
    libraryEntryId: string,
    input: { pages_read: number; duration_minutes?: number },
) {
    try {
        const result = await progressApi.logSession({
            library_entry_id: libraryEntryId,
            ...input,
        });
        revalidatePath(`/library/${libraryEntryId}`);
        revalidatePath('/library');
        revalidatePath('/dashboard');
        return { success: true, newCurrentPage: result.new_current_page };
    } catch (err) {
        if (err instanceof ApiError) return { error: err.message };
        throw err;
    }
}

/**
 * Supprime une entrée et redirige vers /library.
 * Note : on ne retourne rien parce qu'on redirige.
 */
export async function deleteEntry(id: string) {
    try {
        await libraryApi.remove(id);
        revalidatePath('/library');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (err) {
        if (err instanceof ApiError) return { error: err.message };
        throw err;
    }
}