import type { ReadingStatus } from '@/lib/api/types';

const STATUS_CONFIG: Record<ReadingStatus, { label: string; classes: string }> = {
    to_read: {
        label: 'À lire',
        classes: 'bg-status-toread text-status-toread-text',
    },
    reading: {
        label: 'En cours',
        classes: 'bg-status-reading text-status-reading-text',
    },
    read: {
        label: 'Lu',
        classes: 'bg-status-read text-status-read-text',
    },
    abandoned: {
        label: 'Abandonné',
        classes: 'bg-status-abandoned text-status-abandoned-text',
    },
};

export function StatusBadge({ status }: { status: ReadingStatus }) {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
        >
            {config.label}
        </span>
    );
}