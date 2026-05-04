import Link from 'next/link';
import { LoginForm } from './login-form';

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-editorial text-4xl text-ink-900 dark:text-paper-100">
                        Reading SaaS
                    </h1>
                    <p className="mt-3 text-sm text-ink-600 dark:text-paper-300">
                        Reprends ta lecture là où tu l'as laissée
                    </p>
                </div>

                <LoginForm searchParamsPromise={searchParams} />

                <p className="text-center text-sm text-ink-600 dark:text-paper-300">
                    Pas encore de compte ?{' '}
                    <Link
                        href="/signup"
                        className="font-medium text-brick-500 hover:text-brick-600 hover:underline"
                    >
                        S'inscrire
                    </Link>
                </p>
            </div>
        </main>
    );
}