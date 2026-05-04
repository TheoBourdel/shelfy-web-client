import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';

export default async function HomePage() {
    // Si déjà connecté, on file directement au dashboard
    const user = await getCurrentUser();
    if (user) redirect('/dashboard');

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <CtaSection />
            </main>
            <SiteFooter />
        </div>
    );
}

// ===== Header =====
function SiteHeader() {
    return (
        <header className="border-b border-paper-200 bg-paper-50/80 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-editorial text-2xl text-brick-500 dark:text-brick-300">
                        ◐
                    </span>
                    <span className="font-editorial text-xl text-ink-900 dark:text-paper-100">
                        Reading SaaS
                    </span>
                </Link>

                <nav className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-md px-3 py-1.5 text-sm text-ink-700 transition hover:bg-paper-100 dark:text-paper-200 dark:hover:bg-ink-900"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-md bg-brick-500 px-3 py-1.5 text-sm font-medium text-paper-50 transition hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                    >
                        Commencer
                    </Link>
                </nav>
            </div>
        </header>
    );
}

// ===== Hero =====
function HeroSection() {
    return (
        <section className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-brick-500 dark:text-brick-300">
                    Carnet de lecture personnel
                </p>
                <h1 className="mt-4 font-editorial text-5xl leading-tight text-ink-900 sm:text-6xl dark:text-paper-100">
                    Reprends le fil de tes lectures.
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg dark:text-paper-300">
                    Un carnet numérique pour suivre ce que tu lis, ce que tu as aimé, et ce
                    qu&apos;il te reste à découvrir. Sans les notifications, sans les
                    recommandations algorithmiques.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/signup"
                        className="rounded-lg bg-brick-500 px-6 py-3 text-base font-medium text-paper-50 transition hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                    >
                        Créer mon compte
                    </Link>
                    <Link
                        href="/login"
                        className="text-sm text-ink-600 hover:text-ink-900 dark:text-paper-300 dark:hover:text-paper-100"
                    >
                        J&apos;ai déjà un compte →
                    </Link>
                </div>

                <p className="mt-6 text-xs text-ink-500 dark:text-paper-400">
                    Gratuit · Pas de carte bancaire · Suppression du compte en un clic
                </p>
            </div>
        </section>
    );
}

// ===== Features =====
function FeaturesSection() {
    return (
        <section className="border-y border-paper-200 bg-paper-100/50 px-6 py-20 dark:border-ink-800 dark:bg-ink-900/40">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-editorial text-3xl text-ink-900 sm:text-4xl dark:text-paper-100">
                        Tout ce qu&apos;il faut, rien de plus.
                    </h2>
                    <p className="mt-3 text-ink-600 dark:text-paper-300">
                        Conçu pour les lecteurs qui veulent garder une trace, pas être suivis.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    <FeatureCard
                        icon={<SearchIcon />}
                        title="Trouve le bon livre"
                        description="Recherche par titre, auteur ou ISBN. Catalogue mondial via ISBNdb, métadonnées propres et couvertures."
                    />
                    <FeatureCard
                        icon={<ProgressIcon />}
                        title="Suis ta progression"
                        description="À lire, en cours, lu. Page courante, sessions chronométrées, statistiques hebdomadaires en temps réel."
                    />
                    <FeatureCard
                        icon={<NotesIcon />}
                        title="Garde tes pensées"
                        description="Notes personnelles, ratings, étagères thématiques. Ton carnet, tes règles."
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-paper-200 bg-bg-card p-6 dark:border-ink-800">
            <div className="text-brick-500 dark:text-brick-300">{icon}</div>
            <h3 className="mt-4 font-editorial text-xl text-ink-900 dark:text-paper-100">
                {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-paper-300">
                {description}
            </p>
        </div>
    );
}

// ===== CTA final =====
function CtaSection() {
    return (
        <section className="px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-editorial text-3xl text-ink-900 sm:text-4xl dark:text-paper-100">
                    Commence ton carnet aujourd&apos;hui.
                </h2>
                <p className="mt-3 text-ink-600 dark:text-paper-300">
                    Quelques minutes pour ajouter ton premier livre. Gratuit, sans
                    engagement.
                </p>
                <Link
                    href="/signup"
                    className="mt-8 inline-block rounded-lg bg-brick-500 px-6 py-3 text-base font-medium text-paper-50 transition hover:bg-brick-600 dark:bg-brick-300 dark:text-ink-950 dark:hover:bg-brick-100"
                >
                    Démarrer maintenant
                </Link>
            </div>
        </section>
    );
}

// ===== Footer =====
function SiteFooter() {
    return (
        <footer className="border-t border-paper-200 px-6 py-10 dark:border-ink-800">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-ink-500 sm:flex-row dark:text-paper-400">
                <div className="flex items-center gap-2">
                    <span className="font-editorial text-base text-ink-700 dark:text-paper-200">
                        ◐ Reading SaaS
                    </span>
                    <span>· {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hover:text-ink-900 dark:hover:text-paper-100"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/signup"
                        className="hover:text-ink-900 dark:hover:text-paper-100"
                    >
                        S&apos;inscrire
                    </Link>
                </div>
            </div>
        </footer>
    );
}

// ===== Icons =====
function SearchIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function ProgressIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18M7 16V9m5 7V5m5 11v-4" />
        </svg>
    );
}

function NotesIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    );
}