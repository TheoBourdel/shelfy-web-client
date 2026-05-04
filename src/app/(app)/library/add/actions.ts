'use server';

import { revalidatePath } from 'next/cache';
import { libraryApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';

export async function addBookToLibrary(isbn: string) {
    if (!isbn) {
        return { error: 'ISBN manquant' };
    }

    try {
        const entry = await libraryApi.add({ isbn });
        // Invalide le cache du dashboard pour qu'il affiche les nouvelles stats
        revalidatePath('/dashboard');
        revalidatePath('/library');
        return { success: true, entryId: entry.id };
    } catch (err) {
        if (err instanceof ApiError) {
            if (err.code === 'CONFLICT') {
                return { error: 'Ce livre est déjà dans ta bibliothèque' };
            }
            if (err.code === 'NOT_FOUND') {
                return { error: 'Livre introuvable sur ISBNdb' };
            }
            return { error: err.message };
        }
        throw err;
    }
}