<template>
  <div class="form__row" :class="rowClass">
    <div class="select" :class="{ 'select--active': isActive }" ref="select">
      <button type="button" class="select__result" @click="toggle">
        <span>{{ placeholder }}</span>
        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-90e05f7c="">
          <path opacity="0.4" d="M5 5L9.33013 0.5H0.669873L5 5Z" fill="#545454" data-v-90e05f7c=""></path>
        </svg>
      </button>
      <div class="select__list">
        <div class="select__search">
          <input type="text" placeholder="Поиск..." @input="search" v-model="searchInput">
        </div>

        <button
            class="select__item"
            v-for="( item, key ) in items"
            :key="key"
            ref="selectItems"
            @click="selected( item.id, item[optionLabel], item.code )"
        >
          {{ item.name }}
        </button>

        <div class="select__nfound" v-if="notFound">Ничего не найдено</div>
      </div>

      <input type="hidden" v-model="model">
    </div>

    <div class="form__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  name?: string,
  placeholder?: string,
  rowClass?: string,
  error?: string,
  list: any[],
  selectedId?: number
  optionLabel?: string
}>(), {
  error: '',
  placeholder: 'Выбрать',
  optionLabel: 'name'
});

const items = ref(props.list);

const select = ref<HTMLElement | null>(null);

const selectItems = ref(false);
const placeholder = ref(props.placeholder);
const isActive = ref(false);
const searchInput = ref('');
const model = defineModel<string | number>();
const notFound = ref(false);

const toggle = () => {
  isActive.value = !isActive.value;

  const prevSelects = document.querySelectorAll(".select");
  if (prevSelects) {
    prevSelects.forEach((item) => {
      item.classList.remove('select--active');
    })
  }
}

const emit = defineEmits(['getSelectedValue', 'update:modelValue']);

const selected = (id: number, title: string, code?: string) => {
  emit('getSelectedValue', {
    name: props.name,
    id: id,
    title: title,
    code: code
  });

  model.value = id;
  placeholder.value = title;
  isActive.value = false;
}


const onClickOutside = (e: MouseEvent | TouchEvent) => {
  if (!isActive.value) return;
  const el = select.value;
  if (!el) return;

  const target = e.target as Node | null;
  if (target && !el.contains(target)) {
    isActive.value = false;
  }
};

onMounted(() => {

  document.addEventListener('click', onClickOutside, true);
  document.addEventListener('touchstart', onClickOutside, true);

  if (props.hasOwnProperty('selectedId')) {
    const find = props.list.find(value => value.id === props.selectedId);
    if (find) {
      selected(
          find.id,
          find[props.optionLabel],
          find.code
      );
    }
  }
});


onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true);
  document.removeEventListener('touchstart', onClickOutside, true);
});

const search = () => {
  items.value = props.list.filter(item =>
      item.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}
</script>

<style scoped lang="scss">
.select {
  position: relative;
  $root: &;

  &__result {
    min-height: 7rem;
    width: 100%;
    border-radius: 6rem;
    border: 0.1rem solid var(--fg-input-border);
    padding: 0 2.7rem;
    font-size: 1.6rem;
    font-family: var(--ff-regular);

    display: flex;
    align-items: center;
    position: relative;

    & svg {
      position: absolute;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.5rem;
      height: auto;
      transition: var(--tr-regular);
    }

    @media (max-width: $mobile) {
      min-height: 5rem;
      font-size: 1.4rem;
    }
  }

  &__list {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 99;
    background: var(--fg-white);
    border-radius: 2rem;
    border: 0.1rem solid var(--fg-input-border);
    padding: 1rem 2rem;
    max-height: 30rem;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 0;
    pointer-events: none;
  }

  &__item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--fg-input-border);

    @media (any-hover: hover) {
      &:hover {
        opacity: .7;
      }
    }

    &--hide {
      display: none;
    }
  }

  &--active {
    #{$root}__result {
      & svg {
        transform: translateY(-50%) rotate(-180deg);
      }
    }

    #{$root}__list {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__search {
    margin-bottom: .5rem;

    & input {
      height: 5rem;
      border: .1rem solid var(--fg-input-border);
      width: 100%;
      border-radius: 2rem;
      padding: 0 1.5rem;
    }
  }
}
</style>