'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const FILTERS = [
    { value: 'all', label: 'Tout' },
    { value: 'to_read', label: 'À lire' },
    { value: 'reading', label: 'En cours' },
    { value: 'read', label: 'Lus' },
    { value: 'abandoned', label: 'Abandonnés' },
] as const;

export function LibraryFilters({ counts }: { counts: Record<string, number> }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get('status') ?? 'all';

    function buildHref(status: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        const qs = params.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }

    return (
        <nav className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
                const isActive = currentStatus === filter.value;
                const count = counts[filter.value] ?? 0;
                return (
                    <Link
                        key={filter.value}
                        href={buildHref(filter.value)}
                        scroll={false}
                        className={
                            isActive
                                ? 'rounded-full bg-ink-900 px-4 py-1.5 text-sm font-medium text-paper-50 dark:bg-paper-100 dark:text-ink-900'
                                : 'rounded-full border border-paper-200 px-4 py-1.5 text-sm text-ink-700 transition hover:bg-paper-100 dark:border-ink-700 dark:text-paper-200 dark:hover:bg-ink-900'
                        }
                    >
                        {filter.label}
                        <span
                            className={
                                isActive
                                    ? 'ml-2 text-xs opacity-70'
                                    : 'ml-2 text-xs text-ink-500 dark:text-paper-400'
                            }
                        >
                            {count}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}