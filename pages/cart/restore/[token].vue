<template>
  <div class="recovery container">
    <div class="recovery__inner">
      <h1 class="recovery__title">Восстанавливаем вашу корзину…</h1>
      <p class="recovery__text">Секунду, подставляем товары.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Алиас старого формата ссылки из писем: /cart/restore/{token}
// Канонический путь — /cart/recovery/{token}. Просто редиректим, сохраняя токен.
definePageMeta({ title: 'Восстановление корзины' });

const route = useRoute();
const token = String(route.params.token ?? '');

await navigateTo(token ? `/cart/recovery/${token}` : '/cart', { redirectCode: 302 });
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
}
</style>
