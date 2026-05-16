import {defineStore, skipHydrate} from 'pinia';

export const useCookieStore = defineStore('cookieStore', () => {
    const cookie = useLocalStorage('cookie', '');
    const isShow = ref( false );

    const submit = () => {
        isShow.value = false;
        cookie.value = '1';
    }

    const init = () => {
        if ( ! cookie.value ) {
            isShow.value = true;
        }
    }

    return {
        cookie: skipHydrate( cookie ),
        isShow,
        init,
        submit
    }
} )