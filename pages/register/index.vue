<template>
  <div class="register page-padding">
    <div class="register__container container">
      <div class="block__header _left register-block__header">
        <h1 class="block__header-title">Регистрация</h1>
      </div>
      <div class="register__form">
        <FormInput
            name="first_name"
            placeholder="Введите имя*"
            v-model="form.first_name"
        />
        <FormInput
            name="last_name"
            placeholder="Введите фамилию*"
            v-model="form.last_name"
        />
        <FormInput
            name="surname"
            placeholder="Введите отчество*"
            v-model="form.surname"
        />
        <FormInput
            name="phone"
            placeholder="Введите номер телефона*"
            v-model="form.phone"
        />
        <FormInput
            name="email"
            placeholder="Введите вашу email почту*"
            v-model="form.email"
        />
        <div class="form__button">
          <button class="register__form-btn btn" @click="register">Зарегистрироваться</button>
          <FormCheckbox name="policy" label="Нажимая на кнопку, вы соглашаетесь<br> с политикой конфиденциальности" is-checked="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Регистрация',
} )

const form = ref( {
  first_name: 'Test 1',
  last_name: 'Test 1',
  surname: 'Test 1',
  phone: '+7 111 111 11 11',
  email: 'flk-dev@yandex.ru',
  password: 'flk-dev@yandex.ru',
} );

const register = async () => {
  const {data} = await useApi('/register', {
    body: {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      surname: form.value.surname,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password,
    }
  }, 'register', 'POST');
}

</script>

<style scoped lang="scss">
.register-block__header {
  margin-bottom: 2.2rem;
}

.register__form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 3rem;
  row-gap: 2.2rem;

  @media (max-width: $tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
  }
}

.register__form .form__row {
  margin-bottom: 0;
}

.register__form .form__button {
  margin-top: 0;
}

.register__form .btn {
  width: 100%;

  @media (max-width: $mobile) {
    min-height: 5rem;
  }
}

</style>