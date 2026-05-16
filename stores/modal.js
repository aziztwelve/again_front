import {defineStore} from 'pinia';

const lockUnlockBody = ( remove = false ) => {
    const body = document.querySelector('body');
    if ( remove ) {
        body.classList.remove('_lock');
    } else {
        body.classList.add('_lock');
    }
}

const isScrollableFunc = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const modal = document.querySelector(".modal");
            const content = modal.querySelector(".modal__content");

            if (content.clientHeight > window.innerHeight) {
                resolve(true );
            } else {
                resolve(false );
            }
        }, 5);
    } );
}

export const useModal = defineStore('useModal', () => {
    const isActive = ref( false );
    const isScrollable = ref( false );
    const view = ref( {} );
    const props = ref( {} );

    const openModal = ( openView, openProps = {} ) => {
        isActive.value = true;
        view.value = openView;
        props.value = openProps;

        isScrollableFunc().then( (value) => {
            isScrollable.value = value;
        } );

        lockUnlockBody();
    }

    const closeModal = () => {
        isActive.value = false;
        setTimeout( () => {
            view.value = {};
            props.value = {};
        }, 300);

        lockUnlockBody( true );
    }

    return {
        isActive,
        isScrollable,
        view,
        props,
        openModal,
        closeModal
    }
} )