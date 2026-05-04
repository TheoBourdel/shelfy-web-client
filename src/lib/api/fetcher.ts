import { env } from '../env';
import type { ApiErrorBody } from './types';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    /**
     * Token override. Si non fourni, le caller devra l'avoir injecté en amont
     * (apiServer ou apiClient s'occupent de ça).
     */
    token?: string | null;
    /**
     * Force pas de cache (utile pour les Server Components qui doivent voir
     * les données fraîches après un mutation).
     */
    noCache?: boolean;
}

/**
 * Fetcher bas niveau — appelle l'API Express avec le bon token + parse les erreurs.
 * À ne pas utiliser directement : passer par apiServer ou apiClient.
 */
export async function apiFetch<T>(
    path: string,
    options: FetchOptions = {},
): Promise<T> {
    const { method = 'GET', body, token, noCache } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: noCache ? 'no-store' : 'default',
    });

    // 204 No Content : on retourne undefined cast en T
    if (response.status === 204) {
        return undefined as T;
    }

    // Parse de l'éventuelle erreur structurée
    if (!response.ok) {
        let errorBody: ApiErrorBody | null = null;
        try {
            errorBody = (await response.json()) as ApiErrorBody;
        } catch {
            // Pas de JSON, on construit une erreur générique
        }

        throw new ApiError(
            response.status,
            errorBody?.error?.code ?? 'UNKNOWN_ERROR',
            errorBody?.error?.message ?? `HTTP ${response.status}`,
            errorBody?.error?.details,
        );
    }

    return (await response.json()) as T;
}