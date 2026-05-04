import 'server-only';
import { getAccessToken } from '../supabase/auth';
import { ApiError, apiFetch } from './fetcher';
import type {
    BookSearchResult,
    LibraryEntryWithBook,
    LibraryListResponse,
    ReadingStats,
    ShelfWithCount,
    ShelfWithEntries,
    Book,
    ReadingSession,
    Profile
} from './types';

/**
 * Helper interne qui récupère le JWT puis appelle apiFetch.
 * Lance une ApiError 401 si non authentifié.
 */
async function fetchWithAuth<T>(
    path: string,
    options: Parameters<typeof apiFetch>[1] = {},
): Promise<T> {
    const token = await getAccessToken();
    if (!token) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Not authenticated');
    }
    return apiFetch<T>(path, { ...options, token, noCache: true });
}

// ===== Books =====
export const booksApi = {
    search(query: string, options?: { page?: number; pageSize?: number }) {
        const params = new URLSearchParams({ q: query });
        if (options?.page) params.set('page', String(options.page));
        if (options?.pageSize) params.set('pageSize', String(options.pageSize));
        return fetchWithAuth<BookSearchResult>(`/api/v1/books/search?${params}`);
    },
    getByIsbn(isbn: string) {
        return fetchWithAuth<Book>(`/api/v1/books/isbn/${encodeURIComponent(isbn)}`);
    },
    getById(id: string) {
        return fetchWithAuth<Book>(`/api/v1/books/${id}`);
    },
};

// ===== Library =====
export const libraryApi = {
    list(filters?: { status?: string; limit?: number; offset?: number }) {
        const params = new URLSearchParams();
        if (filters?.status) params.set('status', filters.status);
        if (filters?.limit) params.set('limit', String(filters.limit));
        if (filters?.offset) params.set('offset', String(filters.offset));
        const qs = params.toString();
        return fetchWithAuth<LibraryListResponse>(
            `/api/v1/library${qs ? `?${qs}` : ''}`,
        );
    },
    getById(id: string) {
        return fetchWithAuth<LibraryEntryWithBook>(`/api/v1/library/${id}`);
    },
    add(input: { isbn: string; status?: string }) {
        return fetchWithAuth<LibraryEntryWithBook>('/api/v1/library', {
            method: 'POST',
            body: input,
        });
    },
    update(
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
    remove(id: string) {
        return fetchWithAuth<void>(`/api/v1/library/${id}`, { method: 'DELETE' });
    },
    counts() {
        return fetchWithAuth<{
            counts: Record<string, number>;
            total: number;
        }>('/api/v1/library/counts');
    },
};

// ===== Shelves =====
export const shelvesApi = {
    list() {
        return fetchWithAuth<{ shelves: ShelfWithCount[] }>('/api/v1/shelves');
    },
    getById(id: string) {
        return fetchWithAuth<ShelfWithEntries>(`/api/v1/shelves/${id}`);
    },
    create(input: { name: string; description?: string; color?: string }) {
        return fetchWithAuth<ShelfWithCount>('/api/v1/shelves', {
            method: 'POST',
            body: input,
        });
    },
    update(
        id: string,
        input: { name?: string; description?: string | null; color?: string | null },
    ) {
        return fetchWithAuth<ShelfWithCount>(`/api/v1/shelves/${id}`, {
            method: 'PATCH',
            body: input,
        });
    },
    remove(id: string) {
        return fetchWithAuth<void>(`/api/v1/shelves/${id}`, { method: 'DELETE' });
    },
    addEntry(shelfId: string, libraryEntryId: string) {
        return fetchWithAuth<void>(`/api/v1/shelves/${shelfId}/entries`, {
            method: 'POST',
            body: { library_entry_id: libraryEntryId },
        });
    },
    removeEntry(shelfId: string, libraryEntryId: string) {
        return fetchWithAuth<void>(
            `/api/v1/shelves/${shelfId}/entries/${libraryEntryId}`,
            { method: 'DELETE' },
        );
    },
};

// ===== Progress =====
export const progressApi = {
    getStats(period: 'week' | 'month' | 'year' | 'all' = 'all') {
        return fetchWithAuth<ReadingStats>(`/api/v1/progress/stats?period=${period}`);
    },
    listSessions(filters?: { library_entry_id?: string; limit?: number }) {
        const params = new URLSearchParams();
        if (filters?.library_entry_id) {
            params.set('library_entry_id', filters.library_entry_id);
        }
        if (filters?.limit) params.set('limit', String(filters.limit));
        const qs = params.toString();
        return fetchWithAuth<{ sessions: ReadingSession[]; total: number }>(
            `/api/v1/progress/sessions${qs ? `?${qs}` : ''}`,
        );
    },
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
    deleteSession(id: string) {
        return fetchWithAuth<void>(`/api/v1/progress/sessions/${id}`, {
            method: 'DELETE',
        });
    },
};

// ===== Profile =====
export const profileApi = {
    getMe() {
        return fetchWithAuth<Profile>('/api/v1/profile/me');
    },
    updateMe(input: { display_name?: string | null }) {
        return fetchWithAuth<Profile>('/api/v1/profile/me', {
            method: 'PATCH',
            body: input,
        });
    },
};