<template>
  <Teleport to="#teleports">
    <div
        class="modal"
        :class="[{
          'modal--active': isActive,
          'modal--scrollable': isScrollable,
        },
         `modal--${( props.customClass ? props.customClass : '' )}`
        ]"
        @click="close"
    >
      <div class="modal__overflow">
        <div class="modal__content">
          <component
              :is="view"
              v-model="model"
          ></component>

          <button class="modal__close modal__close--mobile" @click="modal.closeModal"></button>
        </div>
      </div>

      <button class="modal__close " @click="modal.closeModal"></button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import isEmptyObject from "~/utils/isEmptyObject";

const model = ref({});
const modal = useModal();
const { isActive, isScrollable, view, props } = storeToRefs(modal);

const close = ( event : any ) => {
  const withinBoundaries = event.composedPath().includes( document.querySelector( '.modal__content' ) );
  if ( ! withinBoundaries ) {
    modal.closeModal();
  }
}
</script>

<style scoped lang="scss">

@media (max-width: $mobile) {
  .modal > .modal__close {
    display: none !important;
  }
}


.modal {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  opacity: 0;
  transition: all 0.5s var(--tr-jolly-leave);
  pointer-events: none;

  $root: &;

  &__overflow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 1em;
    opacity: 0;
    transform: translateY(25rem) scale(0.8);
    transition: all 0.5s var(--tr-jolly-leave), opacity 0.3s var(--tr-jolly-leave);
    overflow-y: auto;
  }

  &__content {
    width: 61rem;
    padding: 3.6rem 2rem 7.1rem;
    box-shadow: var(--box-shadow-modal);
    background: var(--fg-white);
    border-radius: 2rem;
    max-width: 100%;

    @media (max-width: $mobile){
      position: relative;
    }
  }

  &__close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 7rem;
    height: 7rem;
    background: rgba(255, 255, 255, 0.1) ;
    font-size: 1.4rem;
    color: transparent;
    border-radius: 1rem;

    &:after,
    &:before {
      --closer-color: rgba(255, 255, 255, 0.3);
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      display: block;
      width: 2.5rem;
      height: 0.1rem;
      margin-right: auto;
      margin-left: auto;
      border-radius: 1em;
      background-color: var(--closer-color);
      transition: all 0.3s ease;
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }

    &--mobile {
      display: none;

      @media (max-width: $mobile) {
        display: block;
        z-index: 5;
        width: 2.5rem;
        height: 2.5rem;
        background: none;

        &:before,
        &:after {
          --closer-color: var(--fg-black);
        }
      }
    }
  }



  &--active {
    opacity: 1;
    pointer-events: auto;

    #{$root}__overflow {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  &--review {
    & .modal__content {
      width: 94.4rem;
      //padding: 5.5rem 12.5rem 7.6rem 6.2rem;
      padding: 5.5rem 6.2rem 7.6rem 6.2rem;

      @media (max-width: $tablet) {
        padding: 5.5rem 3rem 7.6rem;
      }

      @media (max-width: $mobile) {
        padding: 3.3rem 1rem 2.5rem;
      }
    }
  }

  &--sizes {
    & .modal__content {
      width: 62.4rem;
      padding: 2.5rem 3rem 3.7rem;

      @media (max-width: $mobile) {
        padding: 3.3rem 1.4rem 3rem;
      }
    }
  }

  &--success {
    & .modal__content {
      width: 53.6rem;
      padding: 5.5rem 0 8.3rem;
      text-align: center;

      @media (max-width: $mobile) {
        padding: 3.3rem 4.4rem 4.7rem;
      }
    }
  }

  &--message {
    & .modal__content {
      width: 65rem;
      padding: 5.5rem 0;
      text-align: center;

      @media (max-width: $mobile) {
        padding: 3.3rem 4.4rem 4.7rem;
      }
    }
  }

  &--submitremove {
    & .modal__content {
      max-width: 40rem;
      padding-bottom: 4rem;
    }
  }

  &--oto {
    @media (max-width: $mobile) {
      & .modal__content {
        padding: 4.8rem 1.4rem 2.5rem;
      }

      & .modal__close--mobile {
        top: 1rem;
        right: 1rem;
      }
    }
  }

  &--scrollable {
    :deep(.modal__overflow) {
      align-items: flex-start;
    }
  }
}

:global(.modal__title){
  font-size: var(--fz-h1);
  line-height: var(--fz-h1);
  font-weight: 300;
  text-align: center;
  font-family: var(--ff-cormorant);
}

:global(.modal__title--small){
  font-size: var(--fz-h3);
  line-height: var(--fz-h3);
}
</style>
