<template>
  <div
      class="header__search"
      :class="{ '_active': isActive }"
  >
    <form
      method="GET"
      @submit.prevent="submitSearch"
    >
      <div class="header__search-input">
        <input type="text" name="s" v-model="inputSearch">
      </div>
    </form>
    <button class="header__search-btn" @click.prevent="toggleSearch">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.65753 0.0374889C1.85219 0.431178 -0.186142 2.87459 0.013489 5.60502C0.152705 7.51504 1.30846 9.16346 3.09201 9.98893C4.24514 10.5249 5.55062 10.6519 6.79568 10.3471C7.31052 10.2201 7.95407 9.95084 8.35858 9.68922L8.5372 9.57493L8.71319 9.7451C8.81038 9.83908 9.55637 10.5833 10.368 11.3986C11.3268 12.3612 11.8836 12.9022 11.9519 12.9353C12.0229 12.9708 12.1227 12.9911 12.2619 12.9962C12.4405 13.0064 12.4825 12.9988 12.6086 12.9403C12.8608 12.8184 13 12.6 13 12.3104C13 12.0158 13.0105 12.0285 11.269 10.281C10.4022 9.40983 9.6772 8.68087 9.66144 8.65547C9.63254 8.61991 9.64042 8.59705 9.71134 8.51578C9.87157 8.3202 10.1605 7.87825 10.2971 7.61664C10.5545 7.11881 10.7384 6.56257 10.8251 6.00632C10.8881 5.61264 10.8881 4.88368 10.8251 4.47983C10.6754 3.52735 10.2577 2.61552 9.64042 1.90434C8.74208 0.868046 7.55218 0.222903 6.18103 0.0349483C5.83956 -0.0133095 5.00426 -0.0107698 4.65753 0.0374889ZM6.00241 1.42175C7.12928 1.56907 8.21149 2.25231 8.83402 3.20986C9.28056 3.90072 9.49858 4.76938 9.41978 5.56184C9.3042 6.76322 8.66854 7.80459 7.64674 8.46244C6.31499 9.32347 4.58661 9.32601 3.24961 8.4726C1.73399 7.50488 1.07994 5.70407 1.64206 4.0582C1.84957 3.45115 2.14901 2.98381 2.62708 2.52408C3.53592 1.64272 4.7232 1.25665 6.00241 1.42175Z" fill="#CB0B13"/>
      </svg>
    </button>
    <button class="header__search-close" v-if="inputSearch" @click.prevent="clearSearch">
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M16 1L1 16" stroke="#191919"></path><path opacity="0.3" d="M1 1L16 16" stroke="#191919"></path></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const isActive: Ref = ref( false );
const inputSearch = defineModel<string>();
const router = useRouter();

const toggleSearch = () => {
  if ( ! isActive.value ){
    isActive.value = true;
    return;
  } else {
    isActive.value = false;
    submitSearch();
    clearSearch();
    return;
  }
}

const submitSearch = () => {
  if ( inputSearch.value ) {
    router.replace( { path: '/catalog', query: {
      search: inputSearch.value,
      in_stock: true,
    } } );
  }
}

const clearSearch = () => {
  inputSearch.value = '';
}
</script>

<style scoped lang="scss">
.header__search {
  position: relative;

  &._active svg path {
    fill: var(--fg-gray);
  }

  &._active .header__search-input {
    width: 30.1rem;
    opacity: 1;

    @media (max-width: $mobile) {
      width: 14rem;
    }
  }

  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 5.4rem;
    min-height: 5.4rem;
    position: relative;
    z-index: 5;

    @media (max-width: $mobile) {
      min-width: 3.7rem;
      min-height: 3.7rem;
    }
  }

  &-input {
    position: absolute;
    right: 0;
    height: 5.4rem;
    width: 0;
    border: .1rem solid var(--fg-gray-2);
    opacity: 0;
    transition: var(--tr-regular);
    padding: 1.4rem 8rem 1.4rem 1.9rem;

    & input {
      width: 100%;
      height: 2.7rem;
      border: none;
      border-bottom: .1rem solid rgba(58, 58, 58, .1);
      font-size: 1.4rem;

      @media (max-width: $mobile) {
        font-size: 1rem;
        height: 3.7rem;
      }
    }

    @media (max-width: $mobile) {
      display: flex;
      align-items: center;
      height: 3.7rem;
      border: none;
      padding: 0;
    }
  }

  &-close {
    position: absolute;
    right: 5.4rem;
    width: 1.3rem;
    top: 50%;
    transform: translateY(-50%);

    @media (max-width: $mobile) {
      right: 3.4rem;
    }
  }
}

</style>