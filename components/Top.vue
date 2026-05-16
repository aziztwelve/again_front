<template>
  <div class="top">
    <Vue3Marquee :clone="true" :duration="25">
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
      <span>Мы доставляем по всему миру!</span>
    </Vue3Marquee>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.top {
  background: var(--fg-red);
  padding: .8rem 0 1rem;
  font-weight: 200;
  font-size: 1.8rem;
  line-height: 2.7rem;
  color: var(--fg-white);
  text-align: center;
  box-shadow: 0 -1px 23px 2px rgba(0, 0, 0, 0.09);
  font-family: var(--ff-mulish);
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;

  & span {
    margin-right: 1.5rem;

    &:last-child {
      margin-right: 0;
    }
  }

  @media (max-width: $tablet) {
    font-size: 1.2rem;
    padding: .3rem 0;
  }
}
</style>