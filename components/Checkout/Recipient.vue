<template>
  <div class="checkout__block">
    <div class="checkout__block-title fz-h2">Получатель</div>

    <div class="checkout__recipient-self" v-if="userStore.isAuthenticated">
      <FormCheckbox
          name="recipient_self"
          label="Получатель — я сам"
          v-model="isSelfRecipient"
      />
    </div>

    <div class="checkout__user">
      <FormInput
          name="first_name"
          placeholder="Введите имя*"
          v-model="firstName"
      />
      <FormInput
          name="last_name"
          placeholder="Введите фамилию*"
          v-model="lastName"
      />
      <FormPhoneWithCountry
          v-if="countries"
          :countries="countries.countries"
          :default-country-id="0"
          name="phone"
          placeholder="Введите номер телефона*"
          v-model="phone"
          :error="phoneError"
          @country-changed="handleCountryChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {  Country } from "~/types/countries";

// Загружаем страны
const {data: countries} = await useCountries();
const userStore = useAuthStore();

const firstName = defineModel('firstName');
const lastName = defineModel('lastName');
const phone = defineModel('phone');

const selectedCountry = ref<Country | null>(null);
const phoneError = ref('');

// Чекбокс «Получатель — я сам». По умолчанию выключен:
// пусть юзер явно подтвердит, что заказ на него же.
const isSelfRecipient = ref(false);

watch(isSelfRecipient, (checked) => {
  if (checked) {
    firstName.value = userStore.user?.profile?.first_name || '';
    lastName.value = userStore.user?.profile?.last_name || '';
    phone.value = userStore.user?.profile?.phone || '';
  } else {
    firstName.value = '';
    lastName.value = '';
    phone.value = '';
  }
});

const handleCountryChange = (country: Country) => {
  selectedCountry.value = country;
};

const setPhoneError = (msg: string) => {
  phoneError.value = msg;
};

// Экспортируем selectedCountry и setPhoneError для валидации в родителе
defineExpose({
  selectedCountry,
  setPhoneError
});
</script>

<style scoped lang="scss">
.checkout__recipient-self {
  margin-bottom: 1.5rem;
}
</style>