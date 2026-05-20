import { useRoute } from '#app/composables/router';

export async function useApi<T>(url: string, options: object = {}, slug?: string, method: string = 'GET') {


    const route = useRoute();
    const DEV_URI = useRuntimeConfig().public.DEV_URI;
    const authStore = useAuthStore();

    const finalMethod = (options as any).method || method;

    // Проверяем, является ли body FormData
    const isFormData = (options as any).body instanceof FormData;

    // Базовые headers. Authorization добавляем только при наличии токена —
    // иначе бэкенд (особенно публичные endpoint'ы вроде /public/orders) видит
    // строку "Bearer null" и пытается её резолвить, что ломает гостевой режим.
    const baseHeaders: Record<string, string> = {};

    if (authStore.token) {
        baseHeaders['Authorization'] = `Bearer ${authStore.token}`;
    }

    // Если НЕ FormData - добавляем Content-Type: application/json
    if (!isFormData) {
        baseHeaders['Content-Type'] = 'application/json';
    }

    // Объединяем с пользовательскими headers
    const finalHeaders = {
        ...baseHeaders,
        ...(options as any).headers,
    };

    const finalOptions = {
        ...options,
        method: finalMethod,
        headers: finalHeaders,
    };

    return useFetch<T>(DEV_URI + url, finalOptions);
}

export default useApi;
