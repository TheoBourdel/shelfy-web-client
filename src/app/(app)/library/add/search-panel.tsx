'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { ApiError, apiClient } from '@/lib/api/client';
import type { BookSearchResult } from '@/lib/api/types';
import { BookCard } from '@/components/book-card';
import { addBookToLibrary } from './actions';
import { toast } from '@/lib/toast';

export function SearchPanel() {
    const [query, setQuery] = useState('');
    const [searchState, setSearchState] = useState<{
        forQuery: string;
        status: 'loading' | 'success' | 'error';
        data?: BookSearchResult;
        error?: string;
    } | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const trimmed = query.trim();
    const isQueryValid = trimmed.length >= 2;

    useEffect(() => {
        if (!isQueryValid) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            setSearchState({ forQuery: trimmed, status: 'loading' });
            try {
                const data = await apiClient.searchBooks(trimmed, { pageSize: 10 });
                setSearchState({ forQuery: trimmed, status: 'success', data });
            } catch (err) {
                const message =
                    err instanceof ApiError ? err.message : 'Erreur lors de la recherche';
                setSearchState({ forQuery: trimmed, status: 'error', error: message });
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [trimmed, isQueryValid]);

    // Dérivations — pas besoin de state, on calcule à partir de query + searchState
    const showResults = isQueryValid && searchState?.forQuery === trimmed;
    const loading = showResults && searchState?.status === 'loading';
    const error = showResults && searchState?.status === 'error' ? searchState.error : null;
    const results = showResults && searchState?.status === 'success' ? searchState.data : null;

    return (
        <div className="space-y-6">
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Camus, Tolkien, Sapiens..."
                autoFocus
                className="w-full rounded-lg border border-paper-200 bg-paper-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-500 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-paper-100 dark:placeholder:text-paper-400"
            />

            {loading && (
                <p className="text-sm text-ink-500 dark:text-paper-400">Recherche...</p>
            )}

            {error && (
                <div className="rounded-lg border border-brick-100 bg-brick-50 px-3 py-2.5 text-sm text-brick-700 dark:border-ink-700 dark:bg-ink-900 dark:text-brick-300">
                    {error}
                </div>
            )}

            {results && results.books.length === 0 && (
                <p className="text-sm text-ink-500 dark:text-paper-400">
                    Aucun résultat pour &quot;{trimmed}&quot;.
                </p>
            )}

            {results && results.books.length > 0 && (
                <div className="space-y-3">
                    {results.books.map((book) => (
                        <SearchResultCard
                            key={`${book.isbn13 ?? book.isbn10}-${book.title}`}
                            book={book}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface SearchResult {
    isbn13: string | null;
    isbn10: string | null;
    title: string;
    authors: string[];
    cover_url: string | null;
    publisher: string | null;
}

function SearchResultCard({ book }: { book: SearchResult }) {
    const [isPending, startTransition] = useTransition();
    const [added, setAdded] = useState(false);

    const isbn = book.isbn13 ?? book.isbn10;

    function handleAdd() {
        if (!isbn) {
            toast.error('ISBN indisponible pour ce livre');
            return;
        }

        startTransition(async () => {
            const result = await addBookToLibrary(isbn);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success(`"${book.title}" ajouté à ta bibliothèque`);
            setAdded(true);
        });
    }

    return (
        <BookCard
            title={book.title}
            authors={book.authors}
            coverUrl={book.cover_url}
            publisher={book.publisher}
            isbn={isbn}
            action={
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isPending || added || !isbn}
                    className="rounded-md bg-brick-500 px-3 py-1.5 text-sm font-medium text-paper-50 transition hover:bg-brick-600 disabled:opacity-60 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    {isPending ? 'Ajout...' : added ? '✓ Ajouté' : 'Ajouter'}
                </button>
            }
        />
    );
}