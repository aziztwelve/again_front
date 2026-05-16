import { defineStore, skipHydrate } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { GIFT_CERTIFICATE } from "~/constants/index.js";
import { useGiftCardPaymentStore } from './giftCardPayment';
import { useGiftCardPurchaseStore } from './giftCardPurchase';
import { usePromotionStore } from './promotion';

export const useCartStore = defineStore('cartStore', () => {
    const quantity = ref(0);
    const subtotal = ref(0);
    const total = ref(0);
    const sale = ref(0);
    const cart = useLocalStorage('cart', []);

    // Данные промокода
    const promoCode = ref('');
    const promoData = ref(null);
    const promoMessage = ref('');
    const promoClass = ref('');
    const promoType = ref('');
    const promoDiscount = ref(0);
    const regularDiscount = ref(0);

    // ========================================
    // COMPUTED
    // ========================================

    const hasGiftCertificateInCart = computed(() => {
        return cart.value.some(item => item.name === GIFT_CERTIFICATE);
    });

    // ========================================
    // МЕТОДЫ
    // ========================================

    const init = () => {
        countInCart();
        countCartTotal();

        // Проверяем акции после пересчёта корзины
        if (cart.value.length > 0 && total.value > 0) {
            const promotionStore = usePromotionStore();
            promotionStore.checkApplicable(cart.value, total.value);
        }
    }

    const addToCart = async (product, quantity = 1, variant = null, color = null) => {
        let item = cart.value.find((item) => item.id === product.id);
        if (variant && color) {
            item = cart.value.find((item) => {
                return item.id === product.id
                    && item.product_variant_id === variant.id
                    && item.color_id === color.id;
            });
        } else {
            if (variant) {
                item = cart.value.find((item) => item.id === product.product_variant_id);
            }
            if (color) {
                item = cart.value.find((item) => item.id === product.product_variant_id);
            }
        }

        if (item) {
            if (item.quantity) {
                item.quantity += quantity;
            }
        } else {
            cart.value.push({
                ...product,
                item_key: uuidv4(),
                quantity: quantity,
                color_id: color ? color.id : null,
                product_variant_id: variant ? variant.id : null,
                selected_color: color,
                selected_variant: variant
            });
        }

        countCartTotal();
        countInCart();

        // 🔧 ОБНОВЛЕНО: Используем giftCardPaymentStore
        if (product.name === GIFT_CERTIFICATE) {
            const giftCardPaymentStore = useGiftCardPaymentStore();
            if (giftCardPaymentStore.giftCardCode) {
                giftCardPaymentStore.removeGiftCard();
                giftCardPaymentStore.giftCardMessage = 'Подарочную карту нельзя использовать для оплаты сертификатов. Карта удалена.';
                giftCardPaymentStore.giftCardClass = 'warning';

                setTimeout(() => {
                    giftCardPaymentStore.giftCardMessage = '';
                    giftCardPaymentStore.giftCardClass = '';
                }, 5000);
            }
        }
    }

    const removeFromCart = async (itemKey) => {
        const item = cart.value.find((item) => item.item_key === itemKey);

        if (item) {
            cart.value = cart.value.filter((item) => item.item_key !== itemKey);

            // 🔧 ОБНОВЛЕНО: Используем giftCardPaymentStore
            const giftCardPaymentStore = useGiftCardPaymentStore();
            if (giftCardPaymentStore.giftCardCode) {
                giftCardPaymentStore.calculateGiftCardAmount(total.value);

                const hasOnlyGiftCertificate = cart.value.length > 0 &&
                    cart.value.every(item => item.name === GIFT_CERTIFICATE);

                if (hasOnlyGiftCertificate) {
                    giftCardPaymentStore.removeGiftCard();
                    giftCardPaymentStore.giftCardMessage = 'Подарочную карту нельзя использовать для оплаты сертификатов';
                    giftCardPaymentStore.giftCardClass = 'warning';
                }
            }

            countInCart();
            countCartTotal();
        }
    }

    const getItemQuantity = (itemKey) => {
        const item = cart.value.find((item) => item.item_key === itemKey);
        return item?.quantity
    }

    const countInCart = () => {
        quantity.value = 0;
        cart.value.forEach((item) => {
            quantity.value += item.quantity ? item.quantity : 1;
        });
    }

    const countCartTotal = () => {
        total.value = 0;
        subtotal.value = 0;
        sale.value = 0;
        promoDiscount.value = 0;
        regularDiscount.value = 0;

        cart.value.forEach((item) => {
            const qty = item.quantity ?? 1;

            if (item.promo_code_applied && item.final_price) {
                const finalPrice = parseFloat(item.final_price);
                const originalPrice = parseFloat(item.original_price || item.old_price || item.price);
                const priceAfterDiscount = parseFloat(item.price_after_discount || item.price);

                total.value += qty * finalPrice;
                subtotal.value += qty * originalPrice;

                const itemRegularDiscount = originalPrice - priceAfterDiscount;
                regularDiscount.value += qty * itemRegularDiscount;

                const itemPromoDiscount = item.savings?.promo_savings || 0;
                promoDiscount.value += qty * itemPromoDiscount;

                sale.value += qty * (originalPrice - finalPrice);
            } else {
                let unitPrice = 0;
                let unitOldPrice = 0;

                if (item.selected_variant) {
                    unitPrice = item.selected_variant.price;
                    unitOldPrice = item.selected_variant.old_price ?? item.selected_variant.price;
                } else {
                    unitPrice = item.price;
                    unitOldPrice = item.old_price ?? item.price;
                }

                total.value += qty * unitPrice;
                subtotal.value += qty * unitOldPrice;

                const itemDiscount = unitOldPrice - unitPrice;
                regularDiscount.value += qty * itemDiscount;
                sale.value += qty * itemDiscount;
            }
        });

        if (total.value < 0) total.value = 0;
        if (sale.value < 0) sale.value = 0;
        if (promoDiscount.value < 0) promoDiscount.value = 0;
        if (regularDiscount.value < 0) regularDiscount.value = 0;
    }

    const countCartPromocode = (code, type, amount) => {
        if (type === 'percentage') {
            subtotal.value = total.value;
            sale.value = (total.value * (parseFloat(amount) / 100));
            total.value = total.value - sale.value;
        }

        if (type === 'fixed') {
            subtotal.value = total.value;
            sale.value = parseFloat(amount);
            total.value = total.value - parseFloat(amount);
        }

        promoCode.value = code;
    }

    const setCartQuantity = (itemKey, quantity) => {
        const item = cart.value.find((item) => item.item_key === itemKey);
        if (item) {
            item.quantity = quantity;
            countInCart();
            countCartTotal();
        }
    }

    const getCartForCheckout = () => {
        const items = [];

        cart.value.forEach((item) => {
            const price = item.selected_variant?.price ?? item.price;

            items.push({
                product_id: item.id,
                product_variant_id: item.product_variant_id,
                color_id: item.color_id,
                quantity: item.quantity,
                price: price
            });
        });

        return items;
    }

    const setEmptyCart = async () => {
        cart.value = [];
        quantity.value = 0;
        subtotal.value = 0;
        total.value = 0;
        sale.value = 0;
        promoDiscount.value = 0;
        regularDiscount.value = 0;

        promoCode.value = '';
        promoData.value = null;
        promoMessage.value = '';
        promoClass.value = '';
        promoType.value = '';

        // 🔧 ОБНОВЛЕНО: Очищаем через stores
        const giftCardPaymentStore = useGiftCardPaymentStore();
        const giftCardPurchaseStore = useGiftCardPurchaseStore();

        giftCardPaymentStore.reset();
        giftCardPurchaseStore.reset();

        // Очищаем store акций
        const promotionStore = usePromotionStore();
        promotionStore.reset();

        localStorage.removeItem('promoCode');
    }

    const applyPromoToCart = (responseData) => {
        const { promo_code, applicable_products, not_applicable_products, message } = responseData;

        if (!promo_code || !applicable_products) {
            console.error('Invalid promo data');
            return false;
        }

        promoCode.value = promo_code.code;
        promoData.value = promo_code;

        switch (promo_code.discount_behavior) {
            case 'replace':
                promoMessage.value = 'Промокод заменяет текущие скидки на товарах';
                break;
            case 'stack':
                promoMessage.value = 'Промокод суммируется с другими скидками';
                break;
            case 'skip':
                promoMessage.value = 'Промокод не применяется к товарам, уже участвующим в акциях';
                break;
            default:
                promoMessage.value = message || 'Промокод применен';
        }

        if (not_applicable_products && not_applicable_products.length > 0) {
            promoType.value = 'warning';
            promoClass.value = 'warning';
        } else {
            localStorage.setItem('promoCode', promoCode.value);
            promoType.value = 'success';
            promoClass.value = 'success';
        }

        cart.value.forEach((item) => {
            const foundApplicable = applicable_products.find(
                (product) =>
                    (product.product_id === item.id && !product.variant_id && !item.product_variant_id) ||
                    (product.product_id === item.id && product.variant_id === item.product_variant_id) ||
                    (product.product_id === item.id && product.variant_id === item.selected_variant?.id)
            );

            if (foundApplicable) {
                item.price = parseFloat(foundApplicable.final_price);
                item.final_price = parseFloat(foundApplicable.final_price);
                item.original_price = parseFloat(foundApplicable.original_price);
                item.old_price = parseFloat(foundApplicable.old_price || foundApplicable.original_price);
                item.price_after_discount = parseFloat(foundApplicable.price_after_discount);
                item.savings = foundApplicable.savings;
                item.promo_code_info = foundApplicable.promo_code_info;
                item.promo_code_applied = foundApplicable.promo_code_applied;
                item.discount = foundApplicable.discount;
            } else {
                const foundNotApplicable = not_applicable_products?.find(
                    (product) =>
                        (product.product_id === item.id && !product.variant_id && !item.product_variant_id) ||
                        (product.product_id === item.id && product.variant_id === item.product_variant_id) ||
                        (product.product_id === item.id && product.variant_id === item.selected_variant?.id)
                );

                if (foundNotApplicable) {
                    item.final_price = parseFloat(foundNotApplicable.final_price);
                    item.original_price = parseFloat(foundNotApplicable.original_price);
                    item.old_price = parseFloat(foundNotApplicable.old_price || foundNotApplicable.original_price);
                    item.price_after_discount = parseFloat(foundNotApplicable.price_after_discount);
                    item.savings = foundNotApplicable.savings;
                    item.promo_code_applied = false;
                    item.promo_code_info = null;
                    item.discount = foundNotApplicable.discount;
                }
            }
        });

        countCartTotal();
        return true;
    };

    const removePromoFromCart = () => {
        localStorage.removeItem('promoCode');

        cart.value.forEach((item) => {
            if (item.promo_code_applied) {
                item.final_price = item.price_after_discount || item.price;
                item.price = item.price_after_discount || item.price;
                delete item.promo_code_info;
                delete item.promo_code_applied;
                delete item.savings;
            }
        });

        promoCode.value = '';
        promoData.value = null;
        promoMessage.value = '';
        promoClass.value = '';
        promoType.value = '';

        countCartTotal();
    };

    const getItemInfo = (item) => {
        return {
            hasPromo: item.promo_code_applied || false,
            hasDiscount: item.discount?.has_discount || false,
            finalPrice: item.final_price || item.price,
            originalPrice: item.original_price || item.old_price || item.price,
            savings: item.savings || null,
            promoInfo: item.promo_code_info || null
        };
    };

    // 🔧 НОВОЕ: Метод для получения итога с учётом карты
    const getFinalTotal = () => {
        const giftCardPaymentStore = useGiftCardPaymentStore();
        return giftCardPaymentStore.getFinalTotal(total.value);
    };

    return {
        cart: skipHydrate(cart),
        addToCart,
        removeFromCart,
        getItemQuantity,
        setCartQuantity,
        init,
        getCartForCheckout,
        setEmptyCart,
        countCartPromocode,
        applyPromoToCart,
        removePromoFromCart,
        getItemInfo,
        quantity,
        subtotal,
        total,
        sale,
        promoCode,
        promoData,
        promoClass,
        promoMessage,
        promoType,
        promoDiscount,
        regularDiscount,
        hasGiftCertificateInCart,
        getFinalTotal
    }
});