<template>
  <div class="faq-item" :class="{ 'faq-item--active': isActive }" @click="isActive = ! isActive">
    <div class="faq-item__head">
      <div class="faq-item__title" v-html="title"></div>
      <div class="faq-item__icon">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M16 1L1 16" stroke="#191919"></path><path opacity="0.3" d="M1 1L16 16" stroke="#191919"></path></svg>
      </div>
    </div>
    <div class="faq-item__body">
      <div class="faq-item__content" v-html="text">

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  text: string,
}>();

const isActive = ref( false );
</script>

<style scoped lang="scss">
.faq-item {
  border-radius: 1rem;
  background: var(--fg-white);
  margin-bottom: 1rem;

  --closer-width: 1.5rem !important;
  --closer-height: 1.5rem !important;
  --toggler-line-height: .2rem !important;

  &:last-child {
    margin-bottom: 0;
  }

  $root: &;

  &--active {
    #{$root}__title {
      color: #856B50;
      font-weight: 700;
    }

    #{$root}__icon {
      transform: translateY(-50%) rotate(0);
    }

    #{$root}__body {
      opacity: 1;
      grid-template-rows: 1fr;

      & > * {
        opacity: 1;
        padding-top: 2.5rem;
        padding-bottom: 3rem;

        @media (max-width: $mobile) {
          padding-top: 1.4rem;
          padding-bottom: 2.4rem;
        }
      }
    }
  }
}

.faq-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2.75rem;
  cursor: pointer;
  position: relative;

  @media (max-width: $mobile) {
    padding: 1.6rem 6rem 1.4rem 1.5rem;
  }
}

.faq-item__icon {
  position: absolute;
  right: 2.75rem;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  transition: var(--tr-regular);

  & path {
    opacity: 1;
  }
}

.faq-item__title {
  font-size: 1.8rem;
  transition: var(--tr-regular);

  @media (max-width: $mobile) {
    font-size: 1.5rem;
  }
}

.faq-item__body {
  opacity: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  grid-template-rows: 0fr;
  display: grid;
  transition: all 0.4s;

  & > * {
    min-height: 0;
    opacity: 0;
    transition: padding-top .3s, min-height .5s, opacity .1s;
  }
}

.faq-item__content {
  --pd-right: 3.4rem;
  --pd-left: 2.7rem;

  padding-right: var(--pd-right);
  padding-left: var(--pd-left);
  border-top: .1rem solid rgba(0, 0, 0, .1);

  --fz-regular: 1.8rem;

  @media (max-width: $mobile) {
    --fz-regular: 1.4rem;
    --pd-right: .8rem;
    --pd-left: 1.5rem;
  }
}
</style>