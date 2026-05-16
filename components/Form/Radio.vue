<template>
  <div
      class="form__row radio"
      :class="{ 'is-disabled': disabled }"
  >
    <input
        :disabled="disabled"
        type="radio"
        class="radio__input"
        :name="name"
        :checked="checked"
    >
    <div class="radio__icon"></div>
    <label class="radio__label">
      <span class="radio__label-title" v-html="title"></span>
      <span class="radio__label-text" v-if="text" v-html="text"></span>
    </label>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  checked?: boolean,
  name: string
  title: string,
  text?: string
  disabled?: boolean
}>(), {
  checked: false
})
</script>

<style scoped lang="scss">
.radio {
  position: relative;
}

.radio__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  cursor: pointer;

  &:checked + .radio__icon {
    border-color: var(--fg-red);

    &:after {
      opacity: 1;
    }
  }
}

.radio__icon {
  width: 1.8rem;
  height: 1.8rem;
  position: absolute;
  left: 0;
  top: .1rem;
  border: .1rem solid var(--br-checkbox-icon);
  border-radius: 50%;
  transition: var(--tr-regular);

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--fg-red);
    opacity: 0;
    transition: var(--tr-regular);
  }
}

.radio__label {
  display: block;
  padding-left: 2.9rem;
}

.radio__label-title {
  font-size: var(--fz-regular);
  line-height: 150%;
}

.radio__label-text {
  display: block;
  font-size: var(--fz-secondary);
  color: rgba(0, 0, 0, .29);
  margin-top: .5rem;
  line-height: normal;
  text-decoration: underline;
}


.radio.is-disabled {
  opacity: .55;
  cursor: not-allowed;
}

.radio.is-disabled .radio__input {
  cursor: not-allowed;
}

.radio.is-disabled .radio__label,
.radio.is-disabled .radio__icon {
  cursor: not-allowed;
}

/* если хочешь прям "серый" цвет иконки */
.radio.is-disabled .radio__icon {
  border-color: rgba(0, 0, 0, .2);
}

.radio.is-disabled .radio__icon:after {
  background: rgba(0, 0, 0, .25);
}

/* текст тоже чуть приглушить */
.radio.is-disabled .radio__label-text {
  color: rgba(0, 0, 0, .25);
}


</style>