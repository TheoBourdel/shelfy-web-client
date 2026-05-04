'use client';

import { createClient } from '../supabase/client';
import { ApiError, apiFetch } from './fetcher';
import type {
    BookSearchResult,
    LibraryEntryWithBook,
    ReadingStats,
    Book,
    ReadingSession,
    Profile
} from './types';

/**
 * Récupère le JWT depuis le client Supabase browser.
 * Renvoie null si l'user n'est pas connecté.
 */
async function getBrowserToken(): Promise<string | null> {
    const supabase = createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}

async function fetchWithAuth<T>(
    path: string,
    options: Parameters<typeof apiFetch>[1] = {},
): Promise<T> {
    const token = await getBrowserToken();
    if (!token) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Not authenticated');
    }
    return apiFetch<T>(path, { ...options, token });
}

/**
 * Client API pour les Client Components.
 * Pour les Server Components, utiliser à la place `apiServer` depuis ./server.
 */
export const apiClient = {
    // Books
    searchBooks(query: string, options?: { page?: number; pageSize?: number }) {
        const params = new URLSearchParams({ q: query });
        if (options?.page) params.set('page', String(options.page));
        if (options?.pageSize) params.set('pageSize', String(options.pageSize));
        return fetchWithAuth<BookSearchResult>(`/api/v1/books/search?${params}`);
    },

    // Library
    addToLibrary(input: { isbn: string; status?: string }) {
        return fetchWithAuth<LibraryEntryWithBook>('/api/v1/library', {
            method: 'POST',
            body: input,
        });
    },
    updateEntry(
        id: string,
        input: {
            status?: string;
            current_page?: number;
            rating?: number | null;
            notes?: string | null;
        },
    ) {
        return fetchWithAuth<LibraryEntryWithBook>(`/api/v1/library/${id}`, {
            method: 'PATCH',
            body: input,
        });
    },
    removeFromLibrary(id: string) {
        return fetchWithAuth<void>(`/api/v1/library/${id}`, { method: 'DELETE' });
    },

    // Progress
    logSession(input: {
        library_entry_id: string;
        pages_read: number;
        duration_minutes?: number;
    }) {
        return fetchWithAuth<{ session: ReadingSession; new_current_page: number }>(
            '/api/v1/progress/sessions',
            { method: 'POST', body: input },
        );
    },
    getStats(period: 'week' | 'month' | 'year' | 'all' = 'all') {
        return fetchWithAuth<ReadingStats>(`/api/v1/progress/stats?period=${period}`);
    },
    updateProfile(input: { display_name?: string | null }) {
        return fetchWithAuth<Profile>('/api/v1/profile/me', {
            method: 'PATCH',
            body: input,
        });
    },
};

export { ApiError } from './fetcher';