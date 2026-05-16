export const getImage = ( path: string ) => {
    const imageDefault = '/img/default.jpg';
    if ( ! path ) {
        return imageDefault;
    }

    return useRuntimeConfig().public.DEV_URI + '/product/image/lg_' + path;
}