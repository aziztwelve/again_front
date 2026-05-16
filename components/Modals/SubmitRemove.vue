<template>
  <div class="modal-submit__title modal__title modal__title--small">Хотите удалить товар из корзины?</div>
  <div class="modal-submit__actions">
    <button class="btn _border _thin" @click="closeModal()">Отменить</button>
    <button class="btn _thin" @click="submitRemove">Подтвердить</button>
  </div>
</template>

<script setup lang="ts">
const modal = useModal();
const { closeModal, props } = modal;

const cart = useCartStore();

const submitRemove = () => {
  cart.removeFromCart( props.cartItemKey );
  closeModal();
}
</script>

<style scoped lang="scss">
.modal-submit {
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3.5rem;

    & .btn {
      width: 45%;

      @media (max-width: $mobile) {
        width: 100%;
        margin-bottom: 1.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    @media (max-width: $mobile) {
      flex-direction: column;
    }
  }
}
</style>