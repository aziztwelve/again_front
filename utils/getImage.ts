export const getImage = ( path: string ) => {
    const imageDefault = '/img/default.jpg';
    if ( ! path ) {
        return imageDefault;
    }

    // Картинки отдаёт laravel по /api/product/image/lg_{path}. Они НЕ требуют
    // cookie, поэтому берём стабильный API-домен (API_BASE_URL), а не DEV_URI:
    // DEV_URI переведён на same-origin витрины ради first-party guest_token cookie
    // (см. universal-cart), и привязывать к нему картинки незачем.
    const cfg = useRuntimeConfig().public as { API_BASE_URL?: string; DEV_URI?: string };
    const imageBase = cfg.API_BASE_URL ? `${cfg.API_BASE_URL}/api` : (cfg.DEV_URI ?? '');

    return imageBase + '/product/image/lg_' + path;
}