import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'sidebar:state';

export async function getSidebarState(): Promise<'expanded' | 'collapsed'> {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value === 'collapsed' ? 'collapsed' : 'expanded';
}