<template>
  <ClientOnly>
  <div class="login">
    <div class="login__container container">
      <div class="login__left">
        <Breadcrumbs />
        <div class="block__header login-block__header">
          <h1 class="block__header-title">Вход в кабинет покупателя</h1>
        </div>
        <div class="login__form login-form">
          <div class="login-form__input">
            <FormInput
                name="email"
                placeholder="Введите вашу email почту"
                row-class="login-form__row"
                v-model="loginForm.email"
            />
          </div>
          <div class="login-form__input" v-if="auth.isCodeActive">
            <FormInput
                name="code"
                placeholder="Введите код"
                row-class="login-form__row"
                v-model="loginForm.verification_code"
                :error="codeError"
            />
          </div>
          <button
              v-if="auth.isCodeActive"
              class="login-form__button btn _loader"
              :class="{ '_loading': isLoading }"
              @click="login"
          >
            Войти или зарегистрироваться
          </button>
          <button
              v-else
              class="login-form__button btn _loader"
              :class="{ '_loading': isLoading }"
              @click="getCode"
          >
            Отправить код
          </button>

          <div class="login__error" v-if="formError">{{ formError }}</div>
        </div>
      </div>
      <div class="login__media">
        <picture class="login__media-pic">
          <source media="(max-width: 600px)" data-srcset="./img/login.again/main-mobile.jpg" srcset="/img/login.again/main-mobile.jpg">
          <source media="(min-width: 601px)" data-srcset="./img/login.again/main.jpg" srcset="/img/login.again/main.jpg">
          <img src="/img/login.again/main.jpg" class="login__media-img" alt="">
        </picture>
      </div>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Вход',
  middleware: 'not-auth',
} )

const loginForm = ref( {
  email: '',
  verification_code: '',
} );

const formError = ref( '' );
const codeError = ref( '' );

const auth = useAuthStore();
const isAuthenticated = computed( () => {
  return auth.isAuthenticated;
} );
// computed( () => {
//   if ( auth.isAuthenticated ){
//     return navigateTo( '/profile/settings' );
//   }
// } )


const isLoading = ref( false );
const getCode = async () => {
  formError.value = '';

  isLoading.value = true;
  const data = await auth.sendCode( loginForm.value.email );
  if ( data.value.message ){
    formError.value = data.value.message;
  }

  if ( auth.isCodeActive ) {
    formError.value = '';
  }
  isLoading.value = false;
}

const login = async () => {
  formError.value = '';
  isLoading.value = true;

  const { data } = await auth.login( loginForm.value.email, loginForm.value.verification_code );

  if ( data.message ){
    formError.value = data.message;
  }

  if ( data.errors ){
    codeError.value = data.errors.verification_code[0];
  }

  isLoading.value = false;
}

</script>

<style scoped lang="scss">
.login-block__header {
  margin-bottom: 2.5rem;
  max-width: 46.2rem;

  & .block__header-title {
    text-align: left;
    color: var(--fg-black)
  }
}

.login {
  padding: 2.2rem 0 0;

  @media (max-width: $mobile) {
    padding-bottom: 4.5rem;
  }
}

.login__container {
  display: flex;
  justify-content: space-between;

  @media (max-width: $tablet) {
    flex-direction: column;
  }
}

.login__form {
  max-width: 40rem;
}

.login-form__input {
  margin-bottom: 1.5rem;

  @media (max-width: $mobile) {
    flex-wrap: wrap;
  }
}

.login-form__row {
  margin-bottom: 0;
}

.login-form__code {
  margin-left: 1.7rem;
  font-size: 1.6rem;
  text-decoration: underline;
  border: none;
  background: none;
  color: var(--fg-red);

  @media (max-width: $mobile) {
    font-size: 1.4rem;
    margin-top: 1.1rem;
    margin-left: 0;
  }
}

.login-form__button {
  margin: 2rem 0 0;
  width: 100%;

  @media (max-width: $mobile) {
    min-height: 5rem;
  }
}

.login__media {
  min-width: 56.6rem;

  @media (max-width: $tablet) {
    margin-top: 3rem;
    min-width: auto;
  }
}

.login__media-pic {
  min-height: 63.1rem;
  position: relative;

  @media (max-width: $mobile) {
    min-height: auto;
  }
}

.login__media-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
  border-radius: 3rem 3rem 0 0;

  @media (max-width: $mobile) {
    position: relative;
    width: auto;
    height: auto;
  }
}

.login__error {
  text-align: center;
  padding: 1rem;
  background: var(--fg-red);
  color: var(--fg-white);
  border-radius: 6.5rem;
  margin-top: 2.5rem;
  font-size: 1.2rem;
}

</style>