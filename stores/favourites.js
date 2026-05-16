import {defineStore, skipHydrate} from 'pinia';

export const useFavouritesStore = defineStore('favouritesStore', () => {
    const favourites = useLocalStorage('favourites', []);

    const addToFavourites = ( product ) => {
        if (!favourites.value.some(fav => fav.id === product.id)) {
            favourites.value.push(product)
        }
    }

    const removeFromFavorites = ( productId ) => {
        favourites.value = favourites.value.filter(fav => fav.id !== productId)
    }

    const toggleFavourites = ( product ) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id)
        } else {
            addToFavourites(product);
        }
    }

    const isFavorite = ( productId ) => {
        return favourites.value.some(fav => fav.id === productId)
    }

    // const isFavorite = computed(() => (productId) => {
    //     return favourites.value.some(fav => fav.id === productId)
    // })

    const countInFavourites = () => {
        return favourites.value.length;
    }

    return {
        favourites: skipHydrate( favourites ),
        toggleFavourites,
        isFavorite,
        countInFavourites
    }
} )