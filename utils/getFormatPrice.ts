import type {Product} from "~/types/catalog";
import {el} from "date-fns/locale";

export const getFormatPrice = () => {
    const formattedPrice = (price: number | string) => {
        return parseFloat(price).toLocaleString();
    }

    const getNormalPrice = (price: number, oldPrice?: number) => {
        return formattedPrice(price);
    }


    const getPriceFromProduct = (p: Product) => {
        if (p.selected_variant?.price) {
            return formattedPrice(p.selected_variant.price ?? 0);
        } else if (p.price) {
            return formattedPrice(p.price);
        } else {
            return undefined;
        }
    }
    const getOldPriceFromProduct = (p: Product) => {
        if (p.selected_variant?.old_price) {
            return formattedPrice(p.selected_variant.old_price);
        } else if (p.old_price) {
            return formattedPrice(p.old_price ?? 0);
        } else {
            return undefined;
        }
    }

    return {
        formattedPrice,
        getNormalPrice,
        getPriceFromProduct,
        getOldPriceFromProduct,
    }
}