import type { Countries } from "~/types/countries";

/**
 * Список стран нужен и на SSR, и при гидратации форм. useAsyncData сохраняет
 * ответ в payload Nuxt, поэтому браузер не создаёт второй асинхронный setup
 * формы при обновлении страницы.
 */
export const useCountries = () => useAsyncData<Countries>('countries', async () => {
    const { data, error } = await useApi<Countries>('/countries');

    if (error.value || !data.value) {
        throw error.value ?? new Error('Failed to load countries');
    }

    return data.value;
});
