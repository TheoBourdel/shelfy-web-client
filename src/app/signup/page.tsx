import Link from 'next/link';
import { SignupForm } from './signup-form';

export default function SignupPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-editorial text-4xl text-ink-900 dark:text-paper-100">
                        Reading SaaS
                    </h1>
                    <p className="mt-3 text-sm text-ink-600 dark:text-paper-300">
                        Commence à tenir ton carnet de lecture
                    </p>
                </div>

                <SignupForm />

                <p className="text-center text-sm text-ink-600 dark:text-paper-300">
                    Déjà un compte ?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-brick-500 hover:text-brick-600 hover:underline"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </main>
    );
}