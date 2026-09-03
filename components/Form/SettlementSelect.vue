<template>
  <div class="form__row">
    <div ref="root" class="select" :class="{ 'select--active': isOpen }">
      <button type="button" class="select__result" @click="toggle">
        <span>{{ selectedTitle || placeholder }}</span>
        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" aria-hidden="true"><path opacity="0.4" d="M5 5L9.33013 0.5H0.669873L5 5Z" fill="#545454"/></svg>
      </button>
      <div v-if="isOpen" class="select__list">
        <div class="select__search"><input v-model="query" type="search" autocomplete="off" :placeholder="searchPlaceholder"></div>
        <div v-if="query.trim().length < 2" class="select__nfound">Введите минимум 2 символа для поиска</div>
        <div v-else-if="loading" class="select__nfound">Ищем населённый пункт…</div>
        <template v-else>
          <button v-for="item in settlements" :key="item.code" type="button" class="select__item" @click="select(item)">{{ item.full_name || item.name }}</button>
          <div v-if="!settlements.length" class="select__nfound">Ничего не найдено</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Settlement { code: number; name?: string; full_name?: string; country_code?: string; }

const props = withDefaults(defineProps<{ placeholder?: string; searchPlaceholder?: string; countryCode?: string; }>(), {
  placeholder: 'Населённый пункт', searchPlaceholder: 'Начните вводить название', countryCode: 'RU',
});
const emit = defineEmits<{ select: [settlement: Settlement]; }>();
const root = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const query = ref('');
const selectedTitle = ref('');
const settlements = ref<Settlement[]>([]);
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

watch(query, (value) => {
  if (timer) clearTimeout(timer);
  if (value.trim().length < 2) { settlements.value = []; return; }
  timer = setTimeout(async () => {
    loading.value = true;
    try {
      const {data, error} = await useApi<{ cities: Settlement[] }>('/public/delivery/cdek/cities', {
        query: {query: value.trim(), country_code: props.countryCode || 'RU'},
      });
      settlements.value = error.value ? [] : (data.value?.cities ?? []);
    } finally { loading.value = false; }
  }, 250);
});

const toggle = () => { isOpen.value = !isOpen.value; };
const select = (settlement: Settlement) => {
  selectedTitle.value = settlement.full_name || settlement.name || '';
  query.value = selectedTitle.value;
  isOpen.value = false;
  emit('select', settlement);
};
const onClickOutside = (event: MouseEvent | TouchEvent) => {
  if (isOpen.value && root.value && !root.value.contains(event.target as Node)) isOpen.value = false;
};
onMounted(() => { document.addEventListener('click', onClickOutside, true); document.addEventListener('touchstart', onClickOutside, true); });
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
  document.removeEventListener('click', onClickOutside, true);
  document.removeEventListener('touchstart', onClickOutside, true);
});
</script>

<style scoped lang="scss">
.select { position: relative; }
.select__result { min-height: 7rem; width: 100%; padding: 0 2.7rem; border: .1rem solid var(--fg-input-border); border-radius: 6rem; background: var(--fg-white); display: flex; align-items: center; justify-content: space-between; font: inherit; text-align: left; }
.select__list { position: absolute; z-index: 20; top: calc(100% + .4rem); left: 0; right: 0; max-height: 28rem; overflow: auto; padding: .8rem; border: .1rem solid var(--fg-input-border); border-radius: 1.5rem; background: var(--fg-white); box-shadow: 0 .8rem 2.4rem rgba(0, 0, 0, .12); }
.select__search input { width: 100%; padding: 1.1rem 1.4rem; border: .1rem solid var(--fg-input-border); border-radius: 3rem; font: inherit; }
.select__item { display: block; width: 100%; padding: 1rem 1.2rem; border: 0; border-radius: .8rem; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.select__item:hover { background: var(--bg-gray-item); }
.select__nfound { padding: 1.2rem; color: var(--fg-gray-2); text-align: center; }
@media (max-width: $mobile) { .select__result { min-height: 5.2rem; padding: 0 1.8rem; } }
</style>
