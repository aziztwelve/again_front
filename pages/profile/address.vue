<template>
  <div class="profile-address__form form">
    <div class="profile-address__form-grid">
      <FormSelect
        v-if="countries"
        v-model="form.delivery_country_id.value"
        :error="form.delivery_country_id.error"
        :list="countries.countries"
        placeholder="Выбрать страну"
        :selected-id="user.profile.delivery_country_id"
        @get-selected-value="setCountry"
      />
      <FormInput
          placeholder="Индекс"
          v-model="form.delivery_postal_code.value"
          :error="form.delivery_postal_code.error"
      />
      <FormSelect
          v-if="cities"
          v-model="form.delivery_city_id.value"
          :error="form.delivery_city_id.error"
          :list="cities.cities"
          placeholder="Выбрать город"
          :selected-id="user.profile.delivery_city_id"
      />
      <FormInput
          placeholder="Улица, дом"
          v-model="form.delivery_address.value"
          :error="form.delivery_address.error"
      />
    </div>
    <div class="profile-address__form-actions">
      <button
          class="profile-address__form-btn btn _border"
          :class="{ '_loading': isLoading }"
          :disabled="isButtonDisabled"
          @click="save"
      >Сохранить изменения</button>
      <FormCheckbox
          row-class="profile-address__form-policy"
          name="policy"
          value="1"
          v-model="isChecked"
          :label="getPrivacyPolicyLink()"
      />
<!--      <FormCheckbox-->
<!--          class="form__marketing"-->
<!--          name="marketing_consent"-->
<!--          :label="getMarketingConsentLink()"-->
<!--          v-model="isCheckedMarketing"-->
<!--      />-->
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Cities, Countries} from "~/types/countries";
import {FormInput, FormSelect, ModalsSuccess} from "#components";
import {useFormValidator} from "~/composables/useFormValidator";
import { getPrivacyPolicyLink} from '~/utils/getPolicyLink';

definePageMeta({
  layout: 'profile',
  title: 'Адрес доставки',
  middleware: 'auth'
});

useBirthdayReminder();

const isCheckedMarketing = ref(false);

const countryId = ref( '' );
const setCountry = ( object: object ) => {
  countryId.value = object.id;
}

const { data: countries } = await useApi<Countries>('/countries');
const { data: cities } = await useApi<Cities>( '/countries/cities', {
  query: {
    country_id: countryId
  },
  watch: [ countryId ]
} );

const authStore = useAuthStore();
const { user } = authStore;
const modal = useModal();
const isLoading = ref( false );

const form = ref( {
  delivery_country_id: {
    value: '',
    error: '',
    validation: {
      required: true,
    }
  },
  delivery_postal_code: {
    value: '',
    error: '',
    validation: {
      required: true,
    }
  },
  delivery_city_id: {
    value: '',
    error: '',
    validation: {
      required: true,
    }
  },
  delivery_address: {
    value: '',
    error: '',
    validation: {
      required: true,
    }
  },
} );

onMounted( () => {
  form.value.delivery_postal_code.value = user?.profile?.delivery_postal_code || '';
  form.value.delivery_address.value = user?.profile?.delivery_address || '';
} )

const isChecked = ref( false );
const isButtonDisabled = ref( true );

watch( ( isChecked ), ( oldValue, newValue ) => {
  isButtonDisabled.value = newValue;
} )

const save = async () => {
  const { isFormError, validateForm, resetErrors } = useFormValidator( form );

  resetErrors();
  validateForm();

  if ( isFormError.value ){
    return;
  }

  isLoading.value = true;

  const { data, status, error } = await useApi('/clients/update-delivery-address', {
    body: {
      delivery_country_id: form.value.delivery_country_id.value,
      delivery_postal_code: form.value.delivery_postal_code.value,
      delivery_city_id: form.value.delivery_city_id.value,
      delivery_address: form.value.delivery_address.value
    }
  }, '', 'PUT' );

  if ( status.value === 'error' && error?.value?.data?.errors ){
    for ( const item in error.value.data.errors ){
      if ( form.value[ item ] ){
        form.value[ item ].error = error.value.data.errors[ item ][0];
      }
    }
  } else {
    authStore.updateAddress( form );
    modal.openModal( ModalsSuccess, {
      title: 'Спасибо!',
      text: 'Ваш профиль обновлен'
    } )
  }
}
</script>

<style scoped lang="scss">
.profile-address__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  max-width: 75.6rem;
  column-gap: 2.2rem;
  row-gap: 1.5rem;

  & .form__row {
    margin-bottom: 0;
  }

  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    column-gap: 1.5rem;
  }
}

.profile-address__form-actions {
  display: flex;
  align-items: center;
  margin-top: 3.2rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
    flex-direction: column;
  }
}

.profile-address__form-btn {
  margin: 0;
}

.profile-address__form-reset {
  margin-left: 1.6rem;
  opacity: .5;
  text-decoration: underline;
  color: var(--fg-gray-3);

  @media (max-width: $mobile) {
    margin-left: 0;
    margin-top: 1.2rem;
  }
}

.profile-address__form-policy {
  margin-left: 2rem;

  @media (max-width: $mobile) {
    margin-left: 0;
    margin-top: 2rem;
  }
}

</style>