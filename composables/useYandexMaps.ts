/**
 * Загрузка и инициализация JS API Яндекс.Карт (v2.1).
 *
 * Скрипт грузится один раз на всё приложение (singleton). Повторные вызовы
 * возвращают тот же промис. Работает только на клиенте — на сервере промис
 * никогда не резолвится (компоненты вызывают load() из onMounted).
 */

declare global {
  interface Window {
    ymaps?: any;
  }
}

const SCRIPT_ID = 'yandex-maps-jsapi';

let loadPromise: Promise<any> | null = null;

export function useYandexMaps() {
  const config = useRuntimeConfig();
  const apiKey = (config.public.YANDEX_MAPS_API_KEY as string) || '';

  /**
   * Загружает JS API и резолвится готовым объектом `ymaps` после ymaps.ready().
   */
  const load = (): Promise<any> => {
    if (import.meta.server) {
      return Promise.reject(new Error('Yandex Maps can only be loaded on the client'));
    }

    if (window.ymaps && typeof window.ymaps.ready === 'function') {
      return new Promise((resolve) => window.ymaps.ready(() => resolve(window.ymaps)));
    }

    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      const onReady = () => {
        if (window.ymaps && typeof window.ymaps.ready === 'function') {
          window.ymaps.ready(() => resolve(window.ymaps));
        } else {
          reject(new Error('Yandex Maps API loaded but ymaps is unavailable'));
        }
      };

      if (existing) {
        existing.addEventListener('load', onReady, { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Yandex Maps API')), { once: true });
        return;
      }

      const params = new URLSearchParams({ lang: 'ru_RU' });
      if (apiKey) params.set('apikey', apiKey);

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
      script.async = true;
      script.addEventListener('load', onReady, { once: true });
      script.addEventListener('error', () => {
        loadPromise = null;
        reject(new Error('Failed to load Yandex Maps API'));
      }, { once: true });

      document.head.appendChild(script);
    });

    return loadPromise;
  };

  return {
    load,
    hasApiKey: Boolean(apiKey),
  };
}
