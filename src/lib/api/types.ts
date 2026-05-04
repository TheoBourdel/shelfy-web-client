// ===== Books =====
export interface Book {
    id: string;
    isbn13: string | null;
    isbn10: string | null;
    title: string;
    subtitle: string | null;
    authors: string[];
    publisher: string | null;
    published_date: string | null;
    page_count: number | null;
    language: string | null;
    description: string | null;
    cover_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface BookSearchResult {
    total: number;
    books: Array<{
        isbn13: string | null;
        isbn10: string | null;
        title: string;
        authors: string[];
        cover_url: string | null;
        publisher: string | null;
    }>;
}

// ===== Library =====
export type ReadingStatus = 'to_read' | 'reading' | 'read' | 'abandoned';

export interface LibraryEntry {
    id: string;
    user_id: string;
    book_id: string;
    status: ReadingStatus;
    current_page: number;
    rating: number | null;
    notes: string | null;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface LibraryEntryWithBook extends LibraryEntry {
    book: Book;
}

export interface LibraryListResponse {
    entries: LibraryEntryWithBook[];
    total: number;
}

// ===== Shelves =====
export interface Shelf {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export interface ShelfWithCount extends Shelf {
    entries_count: number;
}

export interface ShelfWithEntries extends Shelf {
    entries: LibraryEntryWithBook[];
}

// ===== Progress =====
export interface ReadingSession {
    id: string;
    library_entry_id: string;
    pages_read: number;
    duration_minutes: number | null;
    logged_at: string;
    created_at: string;
}

export interface ReadingStats {
    period: 'week' | 'month' | 'year' | 'all';
    total_pages: number;
    total_minutes: number;
    sessions_count: number;
    avg_pages_per_session: number;
    books_finished: number;
    books_in_progress: number;
    books_to_read: number;
}

export interface Profile {
    id: string;
    display_name: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
}

// ===== API errors =====
export interface ApiErrorBody {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}