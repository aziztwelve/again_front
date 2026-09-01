<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cdek-modal">
      <button class="cdek-modal__overlay" type="button" aria-label="Закрыть" @click="$emit('close')" />
      <section class="cdek-modal__content" role="dialog" aria-modal="true" aria-label="Выбор пункта СДЭК">
        <header><h3>Пункты самовывоза</h3><button type="button" aria-label="Закрыть" @click="$emit('close')">×</button></header>
        <div class="cdek-modal__toolbar"><input v-model="query" type="search" placeholder="Поиск по адресу или названию" autofocus><div class="cdek-modal__tabs"><button type="button" :class="{ _active: view === 'list' }" @click="view = 'list'">Список</button><button type="button" :class="{ _active: view === 'map' }" @click="openMap">Карта</button></div></div>
        <p v-if="!filtered.length" class="cdek-modal__empty">Пункты не найдены.</p>
        <div v-else-if="view === 'list'" class="cdek-modal__list"><button v-for="point in filtered" :key="point.code" type="button" class="cdek-modal__point" :class="{ _selected: selected?.code === point.code }" @click="select(point, true)"><span class="cdek-modal__radio"><i v-if="selected?.code === point.code" /></span><span><b>{{ point.name || point.code }}</b><em>{{ address(point) }}</em><small v-if="point.work_time">{{ point.work_time }}</small></span></button></div>
        <div v-else class="cdek-modal__map-wrap"><div v-if="mapError" class="cdek-modal__map-error">Не удалось загрузить карту. Выберите пункт в режиме «Список».</div><div v-show="!mapError" ref="mapEl" class="cdek-modal__map" /></div>
        <footer><div v-if="selected" class="cdek-modal__chosen"><b>{{ selected.name || selected.code }}</b><span>{{ address(selected) }}</span></div><button type="button" class="btn _primary" :disabled="!selected" @click="confirm">Выбрать этот {{ pointType === 'POSTAMAT' ? 'постамат' : 'пункт' }}</button></footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
interface Point { code: string; name?: string; work_time?: string; location?: { address?: string; address_full?: string; latitude?: number | string; longitude?: number | string } }
const props = defineProps<{ isOpen: boolean; points: Point[]; pointType?: string; selectedCode?: string | null }>()
const emit = defineEmits<{ close: []; select: [point: Point] }>()
const query = ref(''); const selected = ref<Point | null>(null); const view = ref<'list' | 'map'>('list')
const address = (point: Point) => point.location?.address ?? point.location?.address_full ?? ''
const filtered = computed(() => { const value = query.value.toLowerCase().trim(); return value ? props.points.filter((point) => `${point.name ?? ''} ${address(point)}`.toLowerCase().includes(value)) : props.points })
const { load: loadYandexMaps } = useYandexMaps(); const mapEl = ref<HTMLElement | null>(null); const mapError = ref(false)
let ymaps: any = null; let map: any = null; let clusterer: any = null; const placemarks = new Map<string, any>()
const coords = (point: Point): [number, number] | null => { const lat = Number(point.location?.latitude); const lng = Number(point.location?.longitude); return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null }
const renderMap = () => { if (!map || !ymaps || !clusterer) return; clusterer.removeAll(); placemarks.clear(); const objects: any[] = []; filtered.value.forEach((point) => { const pointCoords = coords(point); if (!pointCoords) return; const mark = new ymaps.Placemark(pointCoords, { balloonContentHeader: point.name || point.code, balloonContentBody: address(point), hintContent: point.name || point.code }, { preset: point.code === selected.value?.code ? 'islands#redDotIcon' : 'islands#blueDotIcon' }); mark.events.add('click', () => select(point, false)); placemarks.set(point.code, mark); objects.push(mark) }); clusterer.add(objects); const bounds = clusterer.getBounds(); if (bounds) map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 38 }) }
const ensureMap = async () => { if (import.meta.server || mapError.value) return; try { ymaps = await loadYandexMaps(); await nextTick(); if (!mapEl.value) return; if (!map) { map = new ymaps.Map(mapEl.value, { center: [55.751574, 37.573856], zoom: 10, controls: ['zoomControl', 'geolocationControl'] }, { suppressMapOpenBlock: true }); clusterer = new ymaps.Clusterer({ preset: 'islands#invertedBlueClusterIcons', groupByCoordinates: false }); map.geoObjects.add(clusterer) }; renderMap() } catch { mapError.value = true } }
const openMap = async () => { view.value = 'map'; await ensureMap() }
const destroyMap = () => { if (map) { try { map.destroy() } catch {} map = null } clusterer = null; placemarks.clear(); mapError.value = false }
const select = (point: Point, moveMap: boolean) => { selected.value = point; renderMap(); const pointCoords = coords(point); if (moveMap && map && pointCoords) map.panTo(pointCoords, { flying: true }) }
const confirm = () => { if (selected.value) { emit('select', selected.value); emit('close') } }
watch(() => props.isOpen, (open) => { if (open) { query.value = ''; view.value = 'list'; selected.value = props.points.find((point) => point.code === props.selectedCode) ?? null } else destroyMap() })
onBeforeUnmount(destroyMap)
watch(filtered, () => renderMap())
</script>

<style scoped lang="scss">
.cdek-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:2rem}.cdek-modal__overlay{position:absolute;inset:0;border:0;background:rgba(0,0,0,.45)}.cdek-modal__content{position:relative;width:min(88rem,100%);height:min(82vh,70rem);display:flex;flex-direction:column;gap:1.4rem;padding:2rem;background:#fff;border-radius:1rem}.cdek-modal header{display:flex;align-items:center;justify-content:center;position:relative}.cdek-modal h3{margin:0;font-size:2rem}.cdek-modal header button{position:absolute;right:0;border:0;background:transparent;font-size:3rem;line-height:1;cursor:pointer}.cdek-modal__toolbar{display:flex;gap:1.2rem}.cdek-modal__toolbar input{flex:1;min-width:0;padding:1.1rem 1.2rem;border:1px solid #ddd;border-radius:.5rem;font:inherit}.cdek-modal__tabs{display:flex;overflow:hidden;border:1px solid #1684d8;border-radius:.5rem}.cdek-modal__tabs button{border:0;border-left:1px solid #1684d8;background:#fff;padding:0 1.5rem;color:#167dcc;font:inherit;cursor:pointer}.cdek-modal__tabs button:first-child{border-left:0}.cdek-modal__tabs ._active{background:#1684d8;color:#fff}.cdek-modal__list{overflow:auto;display:grid;gap:.7rem}.cdek-modal__point{display:flex;gap:1rem;padding:1.1rem;text-align:left;border:1px solid #ddd;border-radius:.6rem;background:#fff;cursor:pointer}.cdek-modal__point._selected{border-color:#1684d8;background:#f5faff}.cdek-modal__point b,.cdek-modal__point em,.cdek-modal__point small{display:block}.cdek-modal__point em{margin-top:.25rem;font-style:normal;color:#555}.cdek-modal__point small{margin-top:.35rem;color:#777}.cdek-modal__radio{flex:0 0 1.6rem;width:1.6rem;height:1.6rem;margin-top:.2rem;border:1px solid #999;border-radius:50%;display:grid;place-items:center}.cdek-modal__radio i{width:.8rem;height:.8rem;border-radius:50%;background:#1684d8}.cdek-modal__map-wrap{min-height:30rem;flex:1;position:relative}.cdek-modal__map{width:100%;height:100%;min-height:30rem}.cdek-modal__map-error{height:100%;display:grid;place-items:center;background:#f7f7f7;color:#666}.cdek-modal__empty{margin:2rem 0}.cdek-modal footer{display:flex;align-items:center;justify-content:space-between;gap:1rem}.cdek-modal__chosen span{display:block;margin-top:.2rem;color:#666}.cdek-modal footer .btn{white-space:nowrap}@media(max-width:650px){.cdek-modal{padding:1rem}.cdek-modal__content{height:90vh;padding:1.4rem}.cdek-modal__toolbar{flex-direction:column}.cdek-modal__tabs button{padding:.8rem 1.2rem}.cdek-modal footer{align-items:flex-end;flex-direction:column}.cdek-modal__map-wrap,.cdek-modal__map{min-height:24rem}}
</style>
