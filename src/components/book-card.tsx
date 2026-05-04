import Image from 'next/image';

interface BookCardProps {
    title: string;
    authors: string[];
    coverUrl: string | null;
    publisher?: string | null;
    isbn?: string | null;
    action?: React.ReactNode;
}

export function BookCard({
    title,
    authors,
    coverUrl,
    publisher,
    isbn,
    action,
}: BookCardProps) {
    return (
        <article className="flex gap-4 rounded-xl border border-paper-200 bg-bg-card p-4 transition hover:border-paper-300 dark:border-ink-800 dark:hover:border-ink-700">
            <div className="relative h-32 w-22 flex-shrink-0 overflow-hidden rounded-md bg-paper-100 dark:bg-ink-900">
                {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={coverUrl}
                        alt={title}
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
                <h3 className="font-editorial text-base leading-snug text-ink-900 dark:text-paper-100 line-clamp-2">
                    {title}
                </h3>
                {authors.length > 0 && (
                    <p className="mt-1 text-sm text-ink-600 dark:text-paper-300 line-clamp-1">
                        {authors.join(', ')}
                    </p>
                )}
                {publisher && (
                    <p className="mt-0.5 text-xs text-ink-500 dark:text-paper-400 line-clamp-1">
                        {publisher}
                    </p>
                )}
                {isbn && (
                    <p className="mt-auto pt-2 font-mono text-xs text-ink-500 dark:text-paper-400">
                        ISBN {isbn}
                    </p>
                )}
                {action && <div className="mt-2">{action}</div>}
            </div>
        </article>
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