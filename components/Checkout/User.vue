<template>
  <div class="checkout__auth">
    <div class="checkout__auth-block" v-if="userStore.isAuthenticated">
      <div class="checkout__auth-text">
        <p>Вы авторизовались как <a href="#"><span>{{ userStore.user?.profile?.last_name }} {{ userStore.user?.profile?.first_name }}</span></a></p>
        <p><a href="#">{{ userStore.user?.profile?.phone }}</a></p>
        <p><a href="#">{{ userStore.user?.email }}</a></p>
      </div>
      <div class="checkout__auth-actions">
        <NuxtLink to="/profile/settings" class="checkout__auth-btn btn _border _gray _dark">Изменить контактные данные</NuxtLink>
        <a href="#" class="checkout__auth-btn _logout btn _border _gray" @click="userStore.logout()">
          <span>Выход</span>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.2">
              <path d="M1.09644 0.0744839C0.673529 0.227203 0.317185 0.548304 0.11356 0.959469L0 1.19442V9.18278V17.1711L0.125308 17.4257C0.195793 17.5666 0.305437 17.7429 0.368091 17.8212C0.642202 18.1501 0.763594 18.201 3.61434 19.1526L6.30454 20.0532L6.71571 20.0415C7.09163 20.0297 7.15428 20.018 7.39315 19.9005C7.86697 19.6656 8.20765 19.2309 8.3173 18.7257C8.34079 18.6122 8.36037 18.2989 8.36037 18.0326V17.5432H9.80141C10.9566 17.5432 11.2894 17.5314 11.4735 17.4844C12.1509 17.3121 12.7931 16.7913 13.0907 16.1687C13.3648 15.6009 13.3766 15.4756 13.3648 13.3336L13.3531 11.454L13.2552 11.2778C13.2004 11.1838 13.079 11.0507 12.9889 10.9841C12.8323 10.8784 12.7892 10.8666 12.5112 10.8666C12.2332 10.8666 12.1901 10.8784 12.0335 10.9841C11.9434 11.0507 11.822 11.1838 11.7672 11.2778L11.6693 11.454L11.6497 13.3728L11.6301 15.2915L11.5401 15.4403C11.4304 15.6126 11.2542 15.7536 11.0662 15.8163C10.9762 15.8437 10.5063 15.8593 9.64869 15.8593H8.36037L8.35254 9.40599L8.34079 2.95656L8.25464 2.74119C8.07843 2.31044 7.69076 1.92277 7.28351 1.76222L7.08771 1.68782H9.00257C10.3301 1.6839 10.9605 1.69957 11.0662 1.72698C11.2503 1.7818 11.4735 1.96193 11.5635 2.1264C11.6223 2.23604 11.634 2.42792 11.6497 3.75931L11.6693 5.26692L11.7789 5.45097C11.9356 5.72116 12.1783 5.8543 12.5112 5.8543C12.7892 5.85038 12.9341 5.79556 13.1142 5.61543C13.357 5.36873 13.3531 5.40398 13.3648 3.79847C13.3766 2.11465 13.357 1.92277 13.0907 1.37455C12.7931 0.751928 12.1509 0.231119 11.4735 0.0588207C11.2738 0.0079155 10.5767 8.2016e-05 6.26538 8.2016e-05C1.56635 0.0039978 1.28049 0.0079155 1.09644 0.0744839Z" fill="black"/>
              <path d="M15.5685 4.2058C15.3688 4.27238 15.2004 4.42118 15.083 4.64047C15.0007 4.78927 14.9968 4.85192 14.9851 6.15591L14.9694 7.51471L13.1603 7.52646L11.3472 7.53821L11.1867 7.65177C10.7599 7.94546 10.709 8.61898 11.0849 8.97533C11.3277 9.20245 11.3316 9.20245 13.2308 9.20245H14.9733L14.9851 10.5456L14.9968 11.8887L15.0986 12.0806C15.2396 12.3626 15.4589 12.5035 15.7761 12.5231C16.2342 12.5544 16.1598 12.6093 18.0629 10.714C19.0145 9.76633 19.8447 8.92051 19.8995 8.83436C20.0248 8.65814 20.0679 8.28222 19.9895 8.03944C19.9504 7.92196 19.5745 7.52254 18.1726 6.11675C17.1701 5.11037 16.34 4.30762 16.2577 4.26454C16.0619 4.16273 15.78 4.13924 15.5685 4.2058Z" fill="black"/>
            </g>
          </svg>
        </a>
      </div>
    </div>

    <!--
      Гостевой режим: блок с email-полем (опционально) и приглашением войти,
      если у пользователя уже есть аккаунт. Имя/фамилия/телефон собираются
      в CheckoutRecipient — здесь не дублируем.

      Кнопка «Войти» вынесена в верх блока, слева — так она заметнее
      и не теряется ниже описательного текста.
    -->
    <div class="checkout__auth-block _guest" v-else>
      <div class="checkout__auth-actions _guest-top">
        <NuxtLink to="/login" class="checkout__auth-btn _compact btn _border _gray _dark">
          Войти
        </NuxtLink>
      </div>
      <p class="checkout__auth-guest-hint">
        Оформляете как гость. Если у вас есть аккаунт — войдите,
        чтобы автоматически сохранить заказ в личном кабинете
        и использовать персональные скидки.
      </p>
      <div class="checkout__guest-fields">
        <FormInput
            name="email"
            type="email"
            placeholder="Email (для отправки чека)"
            v-model="email"
            :error="emailError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useAuthStore();

// Email указывается ТОЛЬКО для гостевого заказа и ОБЯЗАТЕЛЕН — на него
// отправляется чек и ссылка на заказ (/orders/{view_token}).
// Для авторизованного клиента email берётся из его аккаунта на бэкенде.
const email = defineModel<string>('email', { default: '' });

// Ошибка валидации email. Выставляется из useCheckoutSubmit при сабмите
// и показывается инлайн под полем (аналогично ошибке телефона в Recipient).
const emailError = ref('');
const setEmailError = (msg: string) => {
  emailError.value = msg;
};

// Сбрасываем ошибку, как только пользователь начал править поле.
watch(email, () => {
  if (emailError.value) emailError.value = '';
});

defineExpose({ setEmailError });
</script>

<style scoped lang="scss">
.checkout__auth-text {
  & p {
    margin-bottom: 1rem;
    font-size: var(--fz-1-5);
    line-height: 150%;

    & a {
      font-weight: 700;
    }

    & span {
      text-decoration: underline;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.checkout__auth-actions {
  margin-top: 1.9rem;
  display: flex;
  align-items: center;

  // Вариант для гостя: кнопка «Войти» в самом верху блока, выровнена слева,
  // без верхнего отступа — чтобы лежала «прямо в углу» формы.
  &._guest-top {
    margin-top: 0;
    margin-bottom: 1.6rem;
    justify-content: flex-start;
  }
}

.checkout__auth-guest-hint {
  margin-bottom: 1.6rem;
  font-size: var(--fz-1-5);
  line-height: 150%;
  color: var(--fg-gray, #6b6b6b);
}

.checkout__auth-btn {
  min-height: 5.8rem;
  width: auto;
  padding-left: 3rem;
  padding-right: 3rem;
  margin-right: 1.5rem;

  &:last-child {
    margin-right: 0;
  }

  // Компактная версия — для гостевой кнопки «Войти», чтобы не доминировала
  // над email-полем и не «съедала» место.
  // У базового .btn есть width: 38.8rem и margin: 0 auto — из-за этого
  // кнопка визуально центрировалась. Переопределяем: ширина по контенту,
  // прижимаем к левому краю.
  &._compact {
    min-height: 4.4rem;
    width: auto;
    margin: 0;
    padding-left: 2.2rem;
    padding-right: 2.2rem;
    font-size: 1.4rem;
    align-self: flex-start;
  }

  @media (max-width: $mobile) {
    font-size: 1.4rem;
    padding: 1.75rem 1.8rem;
    line-height: 1.4rem;
    min-height: auto;
    text-transform: none;
    margin-left: 0;

    &._logout {
      padding: 0;
      min-width: 5rem;
      min-height: 5rem;
      border-radius: 50%;
    }
  }
}

</style>