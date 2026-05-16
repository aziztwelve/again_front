<template>
  <div class="modal-thanks__title modal__title" v-if="modal.props.title" v-html="modal.props.title"></div>
  <div class="modal-thanks__text" v-if="modal.props.text" v-html="modal.props.text"></div>
  <div class="modal-birthday__action">
    <NuxtLink to="/profile/settings" class="btn _border" @click="close">
      Заполнить дату рождения
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const modal = useModal();

const close = () => {
  modal.closeModal();
};

setTimeout(() => {
  modal.closeModal();
}, 10000);
</script>

<style scoped lang="scss">
.modal-thanks__text {
  max-width: 33.8rem;
  margin: 1.6rem auto 0;
  font-size: 1.6rem;
  line-height: 140%;
  text-align: center;

  @media (max-width: $mobile) {
    font-size: 1.5rem;
    max-width: 100%;
  }
}

.modal-birthday__action {
  margin-top: 2.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;

  .btn {
    display: inline-block;
    min-width: 28rem;
  }
}

.modal-birthday__dismiss {
  font-size: 1.4rem;
  color: var(--fg-gray-3);
  text-decoration: underline;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
