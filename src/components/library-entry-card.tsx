import Link from 'next/link';
import type { LibraryEntryWithBook } from '@/lib/api/types';
import { StatusBadge } from './status-badge';

interface LibraryEntryCardProps {
    entry: LibraryEntryWithBook;
}

export function LibraryEntryCard({ entry }: LibraryEntryCardProps) {
    const { book } = entry;
    const progress =
        book.page_count && book.page_count > 0
            ? Math.min(100, Math.round((entry.current_page / book.page_count) * 100))
            : null;

    return (
        <Link
            href={`/library/${entry.id}`}
            className="group flex gap-4 rounded-xl border border-paper-200 bg-bg-card p-4 transition hover:border-paper-300 dark:border-ink-800 dark:hover:border-ink-700"
        >
            <div className="relative h-32 w-22 flex-shrink-0 overflow-hidden rounded-md bg-paper-100 dark:bg-ink-900">
                {book.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-paper-400 dark:text-ink-600">
                        <BookIcon />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="font-editorial text-base leading-snug text-ink-900 group-hover:text-brick-500 dark:text-paper-100 line-clamp-2">
                            {book.title}
                        </h3>
                        {book.authors.length > 0 && (
                            <p className="mt-1 text-sm text-ink-600 dark:text-paper-300 line-clamp-1">
                                {book.authors.join(', ')}
                            </p>
                        )}
                    </div>
                    <StatusBadge status={entry.status} />
                </div>

                {progress !== null && entry.status === 'reading' && (
                    <div className="mt-auto pt-3">
                        <div className="flex items-center justify-between text-xs text-ink-600 dark:text-paper-300">
                            <span>
                                page {entry.current_page} / {book.page_count}
                            </span>
                            <span>{progress}%</span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-paper-200 dark:bg-ink-800">
                            <div
                                className="h-full bg-brick-500 transition-all dark:bg-brick-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {entry.rating && (
                    <div className="mt-2 flex items-center gap-0.5 text-xs text-brick-500 dark:text-brick-300">
                        {'★'.repeat(entry.rating)}
                        <span className="text-paper-400 dark:text-ink-600">
                            {'★'.repeat(5 - entry.rating)}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}

function BookIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    );
}