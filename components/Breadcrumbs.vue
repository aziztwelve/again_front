<template>
  <div class="breadcrumbs">
    <div class="breadcrumbs__container container">
      <NuxtLink to="/" class="breadcrumbs__link breadcrumbs__home">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5988 6.92677L15.6 6.92799C16.1731 7.50233 16.1729 8.4363 15.5992 9.01027C15.3207 9.28872 14.9509 9.44191 14.5575 9.44191H14.3163V14.2449C14.3163 15.1955 13.543 15.9688 12.5923 15.9688H10.0389C9.77994 15.9688 9.5701 15.7588 9.5701 15.5V11.7344C9.5701 11.3007 9.21732 10.9479 8.7836 10.9479H7.2775C6.84378 10.9479 6.49087 11.3007 6.49087 11.7344V15.5C6.49087 15.7588 6.28103 15.9688 6.02212 15.9688H3.46865C2.51809 15.9688 1.74465 15.1955 1.74465 14.2449V9.44191H1.48464C1.46938 9.44191 1.45424 9.44118 1.43911 9.43972C1.06935 9.42373 0.723651 9.27211 0.461809 9.01015C-0.111312 8.43703 -0.112289 7.50478 0.459002 6.93019L0.465594 6.92348L6.98892 0.400269C7.26724 0.121949 7.63712 -0.03125 8.03055 -0.03125C8.42398 -0.03125 8.79386 0.121949 9.07206 0.400269L15.5988 6.92677Z" fill="#4F4F4F"/>
        </svg>
      </NuxtLink>
      <span class="breadcrumbs__sep">/</span>
      <NuxtLink to="/" class="breadcrumbs__link">Главная</NuxtLink>
      <span class="breadcrumbs__sep">/</span>
      <div class="breadcrumbs__current">{{ route.meta.title }}</div>
    </div>
  </div>

</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped lang="scss">
.breadcrumbs {
  padding: 0 0 4.8rem;

  @media (max-width: $tablet) {
    padding: 1.8rem 0 4.2rem;
  }

  @media (max-width: $mobile) {
    padding: 1.8rem 0 2.9rem;
  }
}

.breadcrumbs__container {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-family: var(--ff-sf-pro);
  color: #7B8990;

  @media (max-width: $mobile) {
    flex-wrap: wrap;
  }
}

.breadcrumbs__sep {
  color: #ECECEC;
  margin: 0 .9rem;
}

.breadcrumbs__link {
  font-weight: 500;
  color: var(--fg-gray-2);
}

</style>