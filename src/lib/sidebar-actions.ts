'use server';

import { cookies } from 'next/headers';

export async function toggleSidebar(nextState: 'expanded' | 'collapsed') {
    const cookieStore = await cookies();
    cookieStore.set('sidebar:state', nextState, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 an
        sameSite: 'lax',
    });
}