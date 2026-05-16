import {defineStore, skipHydrate} from 'pinia';

export const useAsideMenuStore = defineStore('asideMenuStore', () => {
    const isActive = ref( false );
    const view = ref( {} );
    const props = ref( {} );

    const open = ( openView, openProps = {} ) => {
        isActive.value = true;
        view.value = openView;

        if ( openProps ){
            props.value = openProps;
        }
    }

    const close = () => {
        isActive.value = false;
        setTimeout( () => {
            view.value = {};
            props.value = {};
        }, 300 )
    }

    return {
        isActive,
        open,
        close,
        view,
        props
    }
} )