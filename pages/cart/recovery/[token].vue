<template>
  <div class="recovery container">
    <div class="recovery__inner">
      <template v-if="status === 'loading'">
        <h1 class="recovery__title">Восстанавливаем вашу корзину…</h1>
        <p class="recovery__text">Секунду, подставляем товары.</p>
      </template>

      <template v-else-if="status === 'error'">
        <h1 class="recovery__title">Не удалось восстановить корзину</h1>
        <p class="recovery__text">Ссылка устарела или корзина уже не доступна.</p>
        <NuxtLink to="/catalog" class="btn _border _gray _dark recovery__btn">В каталог</NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

definePageMeta({ title: 'Восстановление корзины' });

const route = useRoute();
const cartStore = useCartStore();
const { fetchRecovery } = useServerCart();

const status = ref<'loading' | 'error'>('loading');

const mapItem = (raw: any) => ({
    id: raw.product_id,
    product_variant_id: raw.product_variant_id ?? null,
    color_id: raw.color_id ?? null,
    quantity: raw.qty ?? 1,
    price: raw.price,
    old_price: raw.old_price ?? raw.price,
    discount_percentage: raw.discount_percentage ?? 0,
    total_discount: raw.total_discount ?? 0,
    currency: raw.currency ?? 'RUB',
    name: raw.name,
    slug: raw.slug,
    images: raw.images ?? [],
    selected_variant: null,
    selected_color: null,
    item_key: uuidv4(),
});

onMounted(async () => {
    const token = String(route.params.token ?? '');
    if (!token) {
        status.value = 'error';
        return;
    }

    const items = await fetchRecovery(token);

    if (!items || !items.length) {
        status.value = 'error';
        return;
    }

    // Заменяем локальную корзину восстановленным составом и ведём на /cart.
    cartStore.cart.length = 0;
    items.forEach((raw) => cartStore.cart.push(mapItem(raw)));
    cartStore.init();

    await navigateTo('/cart');
});
</script>

<style scoped lang="scss">
.recovery {
  padding: 6rem 0;
}

.recovery__inner {
  max-width: 60rem;
  margin: 0 auto;
  text-align: center;
}

.recovery__title {
  font-size: var(--fz-3);
  margin-bottom: 1.6rem;
}

.recovery__text {
  font-size: var(--fz-1-5);
  line-height: 150%;
  color: var(--fg-gray, #6b6b6b);
  margin-bottom: 2.4rem;
}

.recovery__btn {
  display: inline-flex;
  width: auto;
  padding-left: 3rem;
  padding-right: 3rem;
}
</style>
