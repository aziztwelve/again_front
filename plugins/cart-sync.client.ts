/**
 * Зеркалирование локальной корзины на универсальную серверную корзину
 * (см. lara_admin/docs/tasks/universal-cart.md).
 *
 * - При первой загрузке витрины синхронизирует существующую localStorage-корзину
 *   на сервер (создаётся гостевая серверная корзина + HttpOnly cookie guest_token).
 * - Далее зеркалит изменения состава (debounce), чтобы бэк всегда знал актуальную
 *   корзину гостя/клиента — для брошенных корзин, восстановления и аналитики.
 *
 * Только клиент: корзина живёт в localStorage, cookie ставит браузер.
 */
export default defineNuxtPlugin(() => {
    const cartStore = useCartStore();
    const { mirrorCart } = useServerCart();

    // Первичная синхронизация после гидрации.
    onNuxtReady(() => {
        if (cartStore.cart.length) {
            mirrorCart();
        }
    });

    // Зеркалим изменения корзины с дебаунсом (склейка частых правок qty).
    watchDebounced(
        () => cartStore.cart,
        () => {
            if (cartStore.cart.length) {
                mirrorCart();
            }
        },
        { deep: true, debounce: 800, maxWait: 4000 },
    );
});
