import type { Countries } from "~/types/countries";

// Простое глобальное хранилище
let countriesCache: Countries | null = null;
let loadingPromise: Promise<Countries> | null = null;

export const useCountries = async () => {
    // Если данные уже есть в кэше, возвращаем их
    if (countriesCache) {
        return {
            data: ref(countriesCache),
            isLoading: ref(false)
        };
    }

    // Если уже идёт загрузка, ждём её завершения
    if (loadingPromise) {
        const result = await loadingPromise;
        return {
            data: ref(result),
            isLoading: ref(false)
        };
    }

    // Первая загрузка - создаём промис
    loadingPromise = (async () => {
        const { data } = await useApi<Countries>('/countries');

        if (data.value) {
            countriesCache = data.value;
            loadingPromise = null; // Сбрасываем промис после загрузки
            return data.value;
        }

        loadingPromise = null;
        throw new Error('Failed to load countries');
    })();

    const result = await loadingPromise;

    return {
        data: ref(result),
        isLoading: ref(false)
    };
};