<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cdek-modal">
      <button class="cdek-modal__overlay" type="button" aria-label="Закрыть" @click="$emit('close')" />
      <section class="cdek-modal__content" role="dialog" aria-modal="true" aria-label="Выбор пункта СДЭК">
        <header><h3>Выберите {{ pointType === 'POSTAMAT' ? 'постамат' : 'пункт выдачи СДЭК' }}</h3><button type="button" @click="$emit('close')">×</button></header>
        <input v-model="query" type="search" placeholder="Поиск по адресу или названию" autofocus>
        <p v-if="!filtered.length" class="cdek-modal__empty">Пункты не найдены.</p>
        <div v-else class="cdek-modal__list">
          <button v-for="point in filtered" :key="point.code" type="button" class="cdek-modal__point" :class="{ _selected: selected?.code === point.code }" @click="selected = point">
            <b>{{ point.name || point.code }}</b><span>{{ address(point) }}</span><small v-if="point.work_time">{{ point.work_time }}</small>
          </button>
        </div>
        <footer><button type="button" class="btn _primary" :disabled="!selected" @click="confirm">Выбрать этот пункт</button></footer>
      </section>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
interface Point { code: string; name?: string; work_time?: string; location?: { address?: string; address_full?: string } }
const props = defineProps<{ isOpen: boolean; points: Point[]; pointType?: string; selectedCode?: string | null }>();
const emit = defineEmits<{ close: []; select: [point: Point] }>();
const query = ref('');
const selected = ref<Point | null>(null);
const address = (point: Point) => point.location?.address ?? point.location?.address_full ?? '';
const filtered = computed(() => { const q = query.value.toLowerCase().trim(); return q ? props.points.filter(p => `${p.name ?? ''} ${address(p)}`.toLowerCase().includes(q)) : props.points; });
watch(() => props.isOpen, open => { if (open) { query.value = ''; selected.value = props.points.find(p => p.code === props.selectedCode) ?? null; } });
const confirm = () => { if (selected.value) { emit('select', selected.value); emit('close'); } };
</script>
<style scoped lang="scss">
.cdek-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:2rem}.cdek-modal__overlay{position:absolute;inset:0;border:0;background:rgba(0,0,0,.45)}.cdek-modal__content{position:relative;width:min(72rem,100%);max-height:85vh;display:flex;flex-direction:column;gap:1.5rem;padding:2rem;background:#fff;border-radius:1rem}.cdek-modal header{display:flex;justify-content:space-between;align-items:center}.cdek-modal h3{margin:0}.cdek-modal header button{border:0;background:none;font-size:3rem}.cdek-modal input{padding:1.2rem;border:1px solid #ddd;border-radius:.6rem;font:inherit}.cdek-modal__list{overflow:auto;display:grid;gap:.8rem}.cdek-modal__point{text-align:left;padding:1.2rem;border:1px solid #ddd;border-radius:.6rem;background:#fff}.cdek-modal__point._selected{border-color:#000;background:#f7f7f7}.cdek-modal__point span,.cdek-modal__point small{display:block;margin-top:.3rem}.cdek-modal__empty{margin:2rem 0}.cdek-modal footer{display:flex;justify-content:flex-end}
</style>
