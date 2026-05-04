'use server';

import { revalidatePath } from 'next/cache';
import { profileApi } from '@/lib/api/server';
import { ApiError } from '@/lib/api/fetcher';

export async function updateProfile(input: { display_name?: string | null }) {
    try {
        await profileApi.updateMe(input);
        revalidatePath('/profile');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (err) {
        if (err instanceof ApiError) return { error: err.message };
        throw err;
    }
}