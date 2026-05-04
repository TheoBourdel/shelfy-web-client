'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toggleSidebar } from '@/lib/sidebar-actions';

interface SidebarProps {
    initialState: 'expanded' | 'collapsed';
    userLabel: string;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { href: '/library', label: 'Bibliothèque', icon: <BookIcon /> },
    { href: '/shelves', label: 'Étagères', icon: <ShelvesIcon /> },
    { href: '/stats', label: 'Statistiques', icon: <ChartIcon /> },
];

const FOOTER_ITEMS: NavItem[] = [
    { href: '/profile', label: 'Profil', icon: <UserIcon /> },
    { href: '/settings', label: 'Paramètres', icon: <SettingsIcon /> },
];

export function Sidebar({ initialState, userLabel }: SidebarProps) {
    const pathname = usePathname();
    const [state, setState] = useState(initialState);
    const [, startTransition] = useTransition();

    const collapsed = state === 'collapsed';

    function handleToggle() {
        const next = collapsed ? 'expanded' : 'collapsed';
        setState(next); // optimiste : pas d'attente
        startTransition(() => {
            toggleSidebar(next);
        });
    }

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-paper-200 bg-paper-100 transition-[width] duration-200 ease-out dark:border-ink-800 dark:bg-ink-950 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Header avec logo */}
            <div className="flex h-16 items-center border-b border-paper-200 px-4 dark:border-ink-800">
                <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                    <span className="font-editorial text-2xl text-brick-500 dark:text-brick-300">
                        ◐
                    </span>
                    {!collapsed && (
                        <span className="font-editorial text-lg text-ink-900 dark:text-paper-100 whitespace-nowrap">
                            Reading SaaS
                        </span>
                    )}
                </Link>
            </div>

            {/* Nav principale */}
            <nav className="flex-1 overflow-y-auto px-2 py-4">
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            collapsed={collapsed}
                            active={isActive(pathname, item.href)}
                        />
                    ))}
                </ul>
            </nav>

            {/* Footer : profil + paramètres + collapse + signout */}
            <div className="border-t border-paper-200 p-2 dark:border-ink-800">
                <ul className="space-y-1">
                    {FOOTER_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            collapsed={collapsed}
                            active={isActive(pathname, item.href)}
                        />
                    ))}
                </ul>

                {/* User + signout */}
                <div className="mt-2 border-t border-paper-200 pt-2 dark:border-ink-800">
                    {!collapsed && (
                        <div className="px-3 pb-2 text-xs text-ink-500 dark:text-paper-400 truncate">
                            {userLabel}
                        </div>
                    )}
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            title={collapsed ? 'Déconnexion' : undefined}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-paper-200 dark:text-paper-200 dark:hover:bg-ink-900 ${collapsed ? 'justify-center' : ''
                                }`}
                        >
                            <SignOutIcon />
                            {!collapsed && <span>Déconnexion</span>}
                        </button>
                    </form>
                </div>

                {/* Bouton toggle collapse */}
                <button
                    type="button"
                    onClick={handleToggle}
                    title={collapsed ? 'Étendre' : 'Réduire'}
                    aria-label={collapsed ? 'Étendre la sidebar' : 'Réduire la sidebar'}
                    className={`mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-500 transition hover:bg-paper-200 dark:text-paper-400 dark:hover:bg-ink-900 ${collapsed ? 'justify-center' : ''
                        }`}
                >
                    <span className="text-base">{collapsed ? '→' : '←'}</span>
                    {!collapsed && <span>Réduire</span>}
                </button>
            </div>
        </aside>
    );
}

function NavLink({
    item,
    collapsed,
    active,
}: {
    item: NavItem;
    collapsed: boolean;
    active: boolean;
}) {
    return (
        <li>
            <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active
                    ? 'bg-brick-500 text-paper-50 dark:bg-brick-300 dark:text-ink-950'
                    : 'text-ink-700 hover:bg-paper-200 dark:text-paper-200 dark:hover:bg-ink-900'
                    } ${collapsed ? 'justify-center' : ''}`}
            >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
            </Link>
        </li>
    );
}

/**
 * Active si pathname commence par href.
 * /library est actif sur /library, /library/123, /library/add — c'est ce qu'on veut.
 * Cas spécial pour /dashboard : exact match sinon il "matche" tout.
 */
function isActive(pathname: string, href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
}

// ===== Icons =====
const iconClass = 'h-5 w-5 flex-shrink-0';

function DashboardIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    );
}

function ShelvesIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18M3 12h18M3 21h18M5 7h2M11 7h2M17 7h2M5 16h2M11 16h2M17 16h2" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18M7 16V9m5 7V5m5 11v-4" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}

function SignOutIcon() {
    return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
    );
}