<template>
  <div class="form__row" :class="rowClass">
    <input
        :type="type"
        :name="name"
        class="form__input"
        :placeholder="placeholder"
        v-model="model"
        @input="handleInput($event)"
        :autocomplete="autocomplete"
    >

    <div class="form__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults( defineProps<{
  type?: string,
  name?: string,
  placeholder?: string,
  rowClass?: string,
  autocomplete?: boolean,
  error?: string
}>(), {
  type: 'text',
  autocomplete: false,
  error: ''
} );

const model = defineModel<string|number>();
const emit = defineEmits(['update:modelValue']);
const handleInput = ($event: InputEvent) => {
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