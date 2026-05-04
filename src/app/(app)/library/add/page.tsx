import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { SearchPanel } from './search-panel';

export default async function AddBookPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
                <div>
                    <h1 className="font-editorial text-3xl text-ink-900 dark:text-paper-100">
                        Ajouter un livre
                    </h1>
                    <p className="mt-2 text-sm text-ink-600 dark:text-paper-300">
                        Cherche par titre ou par auteur. Les résultats viennent d&lsquo;ISBNdb.
                    </p>
                </div>

                <SearchPanel />
            </div>
        </main>
    );
}