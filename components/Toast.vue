<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="{ '_visible': toast.visible }"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0C4.032 0 0 4.032 0 9C0 13.968 4.032 18 9 18C13.968 18 18 13.968 18 9C18 4.032 13.968 0 9 0ZM7.2 13.5L2.7 9L3.969 7.731L7.2 10.953L14.031 4.122L15.3 5.4L7.2 13.5Z" fill="white"/>
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = useToast();
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: 2.4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: #3A3A3A;
  color: #fff;
  font-size: 1.4rem;
  padding: 1.2rem 2rem;
  border-radius: 4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  white-space: nowrap;
  pointer-events: auto;

  & svg {
    flex-shrink: 0;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
