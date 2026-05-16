<template>
<div class="form__row">
  <textarea
      class="form__input"
      :name="name"
      id=""
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="handleInput($event)"
      v-model="model"
  ></textarea>
</div>
</template>

<script setup lang="ts">
defineProps<{
  name: string,
  placeholder?: string
  maxlength?: number
}>();

const model = defineModel<string>();
const emit = defineEmits(['update:modelValue']);
const handleInput = ($event: any) => {
  emit('update:modelValue', ( $event.target as HTMLInputElement ).value)
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

textarea.form__input {
  border-radius: 3rem;
  height: 14rem;
  resize: none;
  padding-top: 2.2rem;
  padding-bottom: 2.2rem;
}
</style>