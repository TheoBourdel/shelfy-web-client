import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { fontSans, fontSerif } from './fonts';
import './globals.css';

export const metadata: Metadata = {
    title: 'Reading SaaS',
    description: 'Ton carnet de lecture personnel',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={`${fontSans.variable} ${fontSerif.variable}`}>
            <body className="font-sans antialiased" suppressHydrationWarning>
                {children}
                <Toaster
                    position="bottom-right"
                    theme="system"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast:
                                'font-sans border border-paper-200 bg-bg-card text-ink-900 dark:border-ink-800 dark:text-paper-100',
                            description: 'text-ink-600 dark:text-paper-300',
                            actionButton: 'bg-brick-500 text-paper-50',
                            cancelButton: 'bg-paper-200 text-ink-700',
                        },
                    }}
                />
            </body>
        </html>
    );
}