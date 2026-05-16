<template>
  <div class="filter-is-new">
    <label class="filter-is-new__checkbox">
      <input
          type="checkbox"
          v-model="isChecked"
          @change="handleChange"
      />
      <span class="filter-is-new__checkmark"></span>
      <span class="filter-is-new__label">Только новинки</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select-is-new', value: boolean): void
}>()

const isChecked = ref(false)

const handleChange = () => {
  emit('select-is-new', isChecked.value)
}

// Сброс фильтра извне
defineExpose({
  reset: () => {
    isChecked.value = false
  }
})
</script>

<style scoped lang="scss">
.filter-is-new__checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    display: none;
  }
}

.filter-is-new__checkmark {
  width: 2rem;
  height: 2rem;
  border: 1px solid #E3E3E3;
  border-radius: 0.4rem;
  background: var(--fg-white);
  position: relative;
  transition: all 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 0.6rem;
    height: 1rem;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg) scale(0);
    transition: transform 0.2s;
  }

  input[type="checkbox"]:checked + & {
    background: var(--bg-filter-button);
    border-color: var(--bg-filter-button);

    &::after {
      transform: translate(-50%, -60%) rotate(45deg) scale(1);
    }
  }
}

.filter-is-new__label {
  font-size: 1.4rem;
  font-weight: 500;
}
</style>