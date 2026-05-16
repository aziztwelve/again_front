<template>
  <div class="filter-fit-type">
    <div
        v-for="type in fitTypes"
        :key="type.value"
        class="filter-fit-type__item"
        :class="{ '_active': selectedType === type.value }"
        @click="selectType(type.value)"
    >
      <svg
          class="filter-fit-type__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Стрелка вниз для низкой посадки -->
        <path
            v-if="type.value === 'low'"
            d="M12 5V19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <!-- Стрелка вверх для высокой посадки -->
        <path
            v-else
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
      </svg>
      <span class="filter-fit-type__label">{{ type.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select-fit-type', value: string | null): void
}>()

const selectedType = ref<string | null>(null)

const fitTypes = [
  { value: 'low', label: 'Низкая посадка' },
  { value: 'tall', label: 'Высокая посадка' },
]

const selectType = (type: string) => {
  if (selectedType.value === type) {
    selectedType.value = null
    emit('select-fit-type', null)
  } else {
    selectedType.value = type
    emit('select-fit-type', type)
  }
}

// Сброс фильтра извне
defineExpose({
  reset: () => {
    selectedType.value = null
  }
})
</script>

<style scoped lang="scss">
.filter-fit-type {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.filter-fit-type__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  border: 1px solid #E3E3E3;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--fg-white);

  &:hover {
    border-color: var(--bg-filter-button);
    background: rgba(var(--bg-filter-button-rgb), 0.05);
  }

  &._active {
    border-color: var(--bg-filter-button);
    background: var(--bg-filter-button);
    color: var(--fg-white);

    .filter-fit-type__icon {
      color: var(--fg-white);
    }
  }
}

.filter-fit-type__icon {
  width: 1.8rem;
  height: 1.8rem;
  color: var(--bg-filter-button);
  transition: color 0.2s;
}

.filter-fit-type__label {
  font-size: 1.4rem;
  font-weight: 500;
}
</style>