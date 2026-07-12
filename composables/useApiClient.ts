import type { FetchOptions } from 'ofetch';

export const useApiClient = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    return async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
        const headers = new Headers(options.headers as HeadersInit | undefined);
        headers.set('Accept', 'application/json');

        if (authStore.token) {
            headers.set('Authorization', `Bearer ${authStore.token}`);
        }

        return await $fetch<T>(`${config.public.DEV_URI}${path}`, {
            ...options,
            headers,
            credentials: 'include',
        });
    };
};
