import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="text-center">
                <h1 className="font-editorial text-4xl text-ink-900 dark:text-paper-100">
                    Livre introuvable
                </h1>
                <p className="mt-2 text-ink-600 dark:text-paper-300">
                    Cette entrée n&apos;existe pas dans ta bibliothèque.
                </p>
                <Link
                    href="/library"
                    className="mt-6 inline-block rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-paper-50 hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    Retour à la bibliothèque
                </Link>
            </div>
        </main>
    );
}