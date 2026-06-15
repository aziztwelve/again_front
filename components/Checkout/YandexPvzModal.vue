<template>
  <Teleport to="body">
    <div v-if="isOpen" class="pvz-modal">
      <div class="pvz-modal__overlay" @click="close"></div>
      <div class="pvz-modal__content">

        <!-- Заголовок -->
        <div class="pvz-modal__header">
          <h3 class="pvz-modal__title">Выберите пункт выдачи</h3>
          <button class="pvz-modal__close" @click="close" aria-label="Закрыть">×</button>
        </div>

        <!-- Поиск по адресу -->
        <div class="pvz-modal__search">
          <input
              v-model="searchQuery"
              class="pvz-modal__search-input"
              type="text"
              placeholder="Поиск по адресу или названию..."
          />
        </div>

        <!-- Тело -->
        <div class="pvz-modal__body">
          <!-- Загрузка -->
          <div v-if="loading" class="pvz-modal__state">
            <span class="pvz-modal__spinner"></span>
            Загружаем пункты выдачи...
          </div>

          <!-- Нет ПВЗ -->
          <div v-else-if="!filteredPoints.length" class="pvz-modal__state">
            <template v-if="!cityName && !geoId">
              Укажите город в форме доставки для показа ближайших ПВЗ.
            </template>
            <template v-else>
              Пункты выдачи не найдены.
              <span v-if="searchQuery"> Попробуйте изменить поисковый запрос.</span>
            </template>
          </div>

          <!-- Список ПВЗ -->
          <div v-else class="pvz-modal__list">
            <div
                v-for="point in filteredPoints"
                :key="point.id"
                class="pvz-modal__item"
                :class="{ '_selected': selectedPoint?.id === point.id }"
                @click="selectPoint(point)"
            >
              <div class="pvz-modal__item-radio">
                <span v-if="selectedPoint?.id === point.id" class="pvz-modal__item-radio-dot"></span>
              </div>
              <div class="pvz-modal__item-info">
                <div class="pvz-modal__item-name">{{ point.name }}</div>
                <div class="pvz-modal__item-address">{{ formatAddress(point) }}</div>
                <div v-if="getSchedule(point)" class="pvz-modal__item-schedule">
                  {{ getSchedule(point) }}
                </div>
                <div v-if="point.is_yandex_branded" class="pvz-modal__item-badge">
                  Яндекс
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Футер с кнопкой подтверждения -->
        <div class="pvz-modal__footer" v-if="selectedPoint">
          <div class="pvz-modal__footer-info">
            <div class="pvz-modal__footer-name">{{ selectedPoint.name }}</div>
            <div class="pvz-modal__footer-address">{{ formatAddress(selectedPoint) }}</div>
          </div>
          <button class="pvz-modal__confirm btn _primary" @click="confirm">
            Выбрать этот пункт
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface PvzPoint {
  id: string;
  name: string;
  address: { full_address?: string; country?: string; city?: string; street?: string; house?: string } | string;
  position?: { latitude: number; longitude: number };
  contact?: { phone?: string };
  schedule?: unknown;
  is_yandex_branded?: boolean;
  operator_id?: string;
  operator_station_id?: string;
}

const props = defineProps<{
  isOpen: boolean;
  geoId?: number;
  cityName?: string;
}>();

const emit = defineEmits<{
  close: [];
  select: [point: PvzPoint];
}>();

const loading       = ref(false);
const pvzList       = ref<PvzPoint[]>([]);
const selectedPoint = ref<PvzPoint | null>(null);
const searchQuery   = ref('');

// ─── Форматирование ────────────────────────────────────────────────────────────
const formatAddress = (point: PvzPoint): string => {
  if (typeof point.address === 'string') return point.address;
  const a = point.address;
  const parts = [a?.city, a?.street, a?.house].filter(Boolean);
  return a?.full_address ?? parts.join(', ') ?? '';
};

const getSchedule = (point: PvzPoint): string => {
  const s: any = point.schedule;
  if (!s || !Array.isArray(s.restrictions) || !s.restrictions.length) return '';
  const r = s.restrictions[0];
  if (!r?.time_from || !r?.time_to) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(r.time_from.hours)}:${pad(r.time_from.minutes)} – ${pad(r.time_to.hours)}:${pad(r.time_to.minutes)}`;
};

// ─── Фильтрация ────────────────────────────────────────────────────────────────
const filteredPoints = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return pvzList.value;
  return pvzList.value.filter((p) => {
    const name = p.name?.toLowerCase() ?? '';
    const addr = formatAddress(p).toLowerCase();
    return name.includes(q) || addr.includes(q);
  });
});

// ─── Загрузка ПВЗ ─────────────────────────────────────────────────────────────
const loadPvz = async () => {
  loading.value  = true;
  pvzList.value  = [];
  selectedPoint.value = null;
  searchQuery.value   = '';

  try {
    const query: Record<string, string> = {};
    if (props.geoId) query.geo_id = String(props.geoId);

    const { data, error } = await useApi('/public/delivery/yandex/pvz', { query });

    if (!error.value && data.value?.success) {
      pvzList.value = data.value.points ?? [];
    }
  } catch (e) {
    console.error('Failed to load PVZ:', e);
  } finally {
    loading.value = false;
  }
};

// Загружаем при открытии модалки или смене geo_id
watch(() => props.isOpen, (open) => {
  if (open) loadPvz();
});

watch(() => props.geoId, (newId, oldId) => {
  if (props.isOpen && newId !== oldId) loadPvz();
});

// ─── Действия ─────────────────────────────────────────────────────────────────
const selectPoint = (point: PvzPoint) => {
  selectedPoint.value = point;
};

const close = () => {
  emit('close');
};

const confirm = () => {
  if (selectedPoint.value) {
    emit('select', selectedPoint.value);
    close();
  }
};
</script>

<style scoped lang="scss">
.pvz-modal {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pvz-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.pvz-modal__content {
  position: relative;
  background: #fff;
  border-radius: 1.2rem;
  width: min(90vw, 56rem);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

// ─── Заголовок ─────────────────────────────────────────────────────────────────
.pvz-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2rem 1.4rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.pvz-modal__title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.pvz-modal__close {
  background: none;
  border: none;
  font-size: 2.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  color: #aaa;
  transition: color 0.15s;

  &:hover { color: #333; }
}

// ─── Поиск ─────────────────────────────────────────────────────────────────────
.pvz-modal__search {
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.pvz-modal__search-input {
  width: 100%;
  padding: 0.9rem 1.4rem;
  border: 1.5px solid #ddd;
  border-radius: 0.8rem;
  font-size: var(--fz-regular);
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;

  &:focus { border-color: var(--color-primary, #000); }
  &::placeholder { color: #bbb; }
}

// ─── Тело ──────────────────────────────────────────────────────────────────────
.pvz-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem 2rem;
}

.pvz-modal__state {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
  justify-content: center;
  color: #999;
  font-size: var(--fz-small);
  text-align: center;
}

.pvz-modal__spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #eee;
  border-top-color: var(--color-primary, #000);
  border-radius: 50%;
  animation: pvz-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes pvz-spin {
  to { transform: rotate(360deg); }
}

// ─── Список ────────────────────────────────────────────────────────────────────
.pvz-modal__list {
  display: grid;
  gap: 0.8rem;
}

.pvz-modal__item {
  display: flex;
  gap: 1.2rem;
  padding: 1.4rem;
  border: 1.5px solid #e8e8e8;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  align-items: flex-start;

  &:hover { border-color: #aaa; }

  &._selected {
    border-color: var(--color-primary, #000);
    background: #fafafa;
  }
}

.pvz-modal__item-radio {
  width: 1.8rem;
  height: 1.8rem;
  border: 1.5px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.2rem;
  transition: border-color 0.15s;

  ._selected & { border-color: var(--color-primary, #000); }
}

.pvz-modal__item-radio-dot {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: var(--color-primary, #000);
}

.pvz-modal__item-info {
  flex: 1;
  min-width: 0;
}

.pvz-modal__item-name {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.pvz-modal__item-address {
  font-size: var(--fz-small);
  color: #555;
  margin-bottom: 0.3rem;
}

.pvz-modal__item-schedule {
  font-size: 1.2rem;
  color: #888;
}

.pvz-modal__item-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.2rem 0.7rem;
  background: #fc0;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
}

// ─── Футер ─────────────────────────────────────────────────────────────────────
.pvz-modal__footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.4rem 2rem;
  border-top: 1px solid #eee;
  flex-shrink: 0;
  background: #fafafa;
  border-radius: 0 0 1.2rem 1.2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.pvz-modal__footer-info {
  flex: 1;
  min-width: 0;
}

.pvz-modal__footer-name {
  font-weight: 600;
  font-size: var(--fz-small);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pvz-modal__footer-address {
  font-size: 1.2rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pvz-modal__confirm {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
