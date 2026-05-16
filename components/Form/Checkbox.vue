<template>
  <div class="checkbox" :class="rowClass">
    <input
        class="checkbox__input"
        type="checkbox"
        :name="name"
        :checked="isChecked"
        v-model="model"
    >
    <span class="checkbox__icon"></span>
    <label class="checkbox__label" v-if="label" :class="{ 'checkbox__flex': isLabelObject }">
      <template v-if="isLabelObject">
        <div class="сheckbox__main">
          <div class="checkbox__title" v-html="label.title"></div>
          <a href="#" class="checkbox__link" v-if="label.link" v-html="label.link"></a>
        </div>
        <div class="checkbox__price" v-if="label.price" v-html="label.price"></div>
      </template>
      <template v-else>
        <div v-html="label"></div>
      </template>
    </label>
  </div>
</template>

<script setup lang="ts">
type objectLabel = {
  title: string,
  link?: string,
  price?: string
}

const props = withDefaults(defineProps<{
  name: string,
  label: string | objectLabel,
  isChecked?: boolean,
  rowClass?: string,
  value?: string,
}>(), {
  isChecked: false
});

const isLabelObject = ref(false);
onMounted(() => {
  isLabelObject.value = typeof props.label === 'object';
})

const model = defineModel<boolean>();
const emit = defineEmits(['update:modelValue']);
const handleInput = ($event: InputEvent) => {
  emit('update:modelValue', ($event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.checkbox {
  position: relative;

  &._icon {
    & .checkbox__icon {
      display: block;
      position: relative;
    }
  }
}

.checkbox__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  margin: 0;
  cursor: pointer;
}

.checkbox__label {
  padding-left: 3rem;
  display: block;
  font-size: 1.168rem;
  line-height: normal;
  color: var(--fg-gray);
  font-family: var(--ff-regular);

  :deep(a) {
    position: relative;
    z-index: 15;
    color: var(--fg-red);
    border-bottom: .1rem solid var(--fg-red);
  }

  @media (max-width: $mobile) {
    padding-left: 2.6rem;
  }
}

.checkbox__icon {
  position: absolute;
  left: 0;
  top: .1rem;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: .2rem;
  border: .1rem solid var(--br-checkbox-icon);
  transition: var(--tr-regular);

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: .791rem;
    height: .558rem;
    background: url('../img/icons.again/icon-checkbox.svg') center center no-repeat;
    background-size: contain;
    transition: var(--tr-regular);
    opacity: 0;
  }

  @media (max-width: $mobile) {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.checkbox__input:checked + .checkbox__icon {
  border-color: var(--fg-red);

  &:after {
    opacity: 1;
  }
}

.checkbox__flex {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.checkbox__title {
  line-height: 150%;
  color: var(--fg-gray);
  font-size: 1.6rem;

  @media (max-width: $mobile) {
    font-size: 1.5rem;
  }
}

.checkbox__link {
  display: inline-block;
  color: rgba(0, 0, 0, .29) !important;
  font-size: 1.4rem;
  text-decoration: underline !important;
  margin-top: .2rem;

  @media (max-width: $mobile) {
    font-size: 1.3rem;
  }
}

.checkbox__price {
  color: var(--fg-gray);
  font-size: var(--fz-regular);
}

</style>