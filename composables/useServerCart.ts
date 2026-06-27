/**
 * Интеграция с универсальной серверной корзиной бэкенда
 * (см. lara_admin/docs/tasks/universal-cart.md).
 *
 * Локальная корзина (useLocalStorage('cart')) остаётся источником истины для
 * UI, но зеркалится на сервер, чтобы работали: брошенные корзины, восстановление
 * по ссылке, аналитика, гостевые напоминания. Идентичность гостя — HttpOnly
 * cookie guest_token (ставит бэк, браузер шлёт автоматически благодаря
 * credentials:'include' в useApi).
 */
export function useServerCart() {
    const cartStore = useCartStore();

    /**
     * Зеркалит локальную корзину на сервер (полная замена состава).
     * POST /cart/items/bulk → backend sync(delete_others=true).
     */
    const mirrorCart = async (): Promise<void> => {
        const items = cartStore.getCartForCheckout();
        if (!items.length) {
            return; // пустую корзину не синкаем — заказ/детект разрулят сами
        }

        try {
            await useApi('/cart/items/bulk', { body: { items } }, '', 'POST');
        } catch (e) {
            if (process.dev) console.warn('[serverCart] mirror failed', e);
        }
    };

    /**
     * Сохранить контакты и согласие гостя на рассылку (opt-in).
     * PATCH /cart/contact — делает гостевую корзину eligible для напоминаний.
     */
    const saveContact = async (payload: {
        email?: string | null;
        phone?: string | null;
        consent?: boolean;
    }): Promise<void> => {
        try {
            await useApi('/cart/contact', { body: payload }, '', 'PATCH');
        } catch (e) {
            if (process.dev) console.warn('[serverCart] saveContact failed', e);
        }
    };

    /**
     * Получить состав корзины по recovery_token (ссылка из письма).
     * GET /public/cart/recovery/{token}.
     */
    const fetchRecovery = async (token: string): Promise<any[] | null> => {
        const { data, error } = await useApi<{ success: boolean; items: any[] }>(
            `/public/cart/recovery/${encodeURIComponent(token)}`,
            {},
            '',
            'GET',
        );

        if (error.value || !data.value?.success) {
            return null;
        }

        return data.value.items ?? [];
    };

    return { mirrorCart, saveContact, fetchRecovery };
}

export default useServerCart;
