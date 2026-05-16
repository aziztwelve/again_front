<template>
  <div class="form__row" :class="[rowClass, { '_highlight': highlight }]">
    <VueDatePicker
        :placeholder="placeholder"
        v-model="model"
        :enable-time-picker="false"
        :format="format"
        :format-locale="ru"
        :disabled="disabled"
        select-text="Выбрать"
        cancel-text="Отменить"
    ></VueDatePicker>
    <div class="form__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ru from 'date-fns/locale/ru/index.js';

const props = withDefaults(defineProps<{
  name: string,
  placeholder?: string,
  rowClass?: string,
  error?: string,
  disabled?: boolean,
  highlight?: boolean
}>(), {
  disabled: false,
  highlight: false
});

const model = defineModel<string|number>();
const emit = defineEmits(['update:modelValue']);

const format = (date) => {
  return ('0' + date.getDate()).slice(-2) + '.'
      + ('0' + (date.getMonth()+1)).slice(-2) + '.'
      + date.getFullYear();
}

const formatDateOutput = (date) => {
  return date.getFullYear() + '-' +  ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}
</script>

<style scoped lang="scss">
.form__input {
  width: 100%;
  height: 7rem;
  border-radius: 6rem;
  border: .1rem solid var(--fg-input-border);
  padding: 0 2.7rem;
  font-size: 1.6rem;
  font-family: var(--ff-regular);

  &::placeholder {
    color: var(--fg-input-plachoder);
  }

  &._light {
    border-color: var(--fg-white);
  }

  @media (max-width: $mobile) {
    height: 5rem;
    font-size: 1.4rem;
  }
}

:deep(.dp__input_wrap) {
  & input {
    width: 100%;
  }
}

:deep(.dp__input){
  height: 7rem;
  border: .1rem solid var(--fg-input-border);
  padding: 0 4rem 0 6rem;
  font-size: 1.6rem;
  border-radius: 6rem;
  font-weight: 400;
  color: inherit;
  
  @media (max-width: $mobile) {
    height: 5rem;
    font-size: 1.4rem;
  }
}

:deep(.dp__input_icon) {
  left: 1rem;
  width: 2rem;
  height: auto;
}

:deep(.dp--clear-btn) {
  right: 2rem;
}

:deep(.dp--clear-btn svg){
  width: 1.5rem;
  height: auto;
}

:deep(.dp__menu) {
  font-size: 1.6rem;
  --dp-preview-font-size: 1.6rem;

  @media (max-width: $mobile) {
    font-size: 1.4rem;
    --dp-preview-font-size: 1.4rem;
  }
}

.form__row._highlight {
  :deep(.dp__input) {
    border-color: var(--fg-red);
    animation: highlight-pulse 2s ease-in-out infinite;
  }
}

@keyframes highlight-pulse {
  0%, 100% {
    border-color: var(--fg-red);
  }
  50% {
    border-color: var(--fg-input-border);
  }
}

:deep(.dp__disabled) {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>