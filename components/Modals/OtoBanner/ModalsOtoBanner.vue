<template>
  <div class="modal-oto">
    <div class="modal-oto__image" v-if="banner?.image">
      <img :src="banner.image.url" :alt="banner.name">
    </div>

    <div class="modal-oto__content">
      <div class="modal-oto__title modal__title" v-if="banner?.title" v-html="banner.title"></div>
      <div class="modal-oto__subtitle" v-if="banner?.subtitle" v-html="banner.subtitle"></div>

      <div class="modal-oto__form form">

        <template v-if="banner?.input_field_enabled">
          <!-- Если тип поля - телефон, используем FormPhoneWithCountry -->
          <FormPhoneWithCountry
              v-if="getInputType() === 'tel' && countries"
              :countries="countries.countries"
              :default-country-id="0"
              :placeholder="banner?.input_field_placeholder || banner?.input_field_label || 'Введите номер телефона'"
              v-model="form.input_field_value.value"
              :error="form.input_field_value.error"
              row-class="_15"
              @country-changed="handleCountryChange"
          />

          <!-- Для остальных типов используем обычные компоненты -->
          <component
              v-else
              :is="getInputComponent()"
              :type="getInputType()"
              name="input_field_value"
              :placeholder="banner?.input_field_placeholder || banner?.input_field_label || 'Введите данные'"
              :error="form.input_field_value.error"
              v-model="form.input_field_value.value"
              row-class="_15"
          />
        </template>

        <div class="form__button" v-if="banner?.button_enabled">
          <button
              class="modal-oto__btn btn _loader _wide"
              @click="send"
              :disabled="isButtonDisabled"
              :class="{ '_loading': isLoading }"
          >
            {{ banner?.button_text || 'Отправить' }}
          </button>
        </div>

        <div class="modal-oto__checkboxes">
          <FormCheckbox
              class="form__policy"
              name="policy"
              :label="getPrivacyPolicyLink()"
              v-model="isCheckedPolicy"
          />
          <FormCheckbox
              class="form__policy"
              name="oferta"
              :label="getOfertaLink()"
              v-model="isCheckedOferta"
          />
          <FormCheckbox
              class="form__policy"
              name="marketing_consent"
              :label="getMarketingConsentLink()"
              v-model="isCheckedMarketing"
          />
        </div>

      </div>

      <div class="modal-oto__privacy" v-if="banner?.privacy_text" v-html="banner.privacy_text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FormInput, FormPhoneWithCountry} from "#components"
import {useFormValidator} from "~/composables/useFormValidator"
import type {OtoBanner} from "~/types/oto-banner/otoBanner"
import type {Country} from "~/types/countries"
import {getMarketingConsentLink, getOfertaLink, getPrivacyPolicyLink} from '~/utils/getPolicyLink';

// Загружаем список стран
const {data: countries} = await useCountries();

// Получаем props из modal store
const modalStore = useModal()
const banner = computed(() => modalStore.props.banner as OtoBanner)

const form = ref({
  input_field_value: {
    value: '',
    error: '',
    validation: {
      required: banner?.value.input_field_required || false
    }
  }
})

const isLoading = ref(false)

const isCheckedPolicy = ref(false);
const isCheckedOferta = ref(false);
const isCheckedMarketing = ref(false);

const isButtonDisabled = ref(true);

// Храним выбранную страну для валидации телефона
const selectedCountry = ref<Country | null>(null);

watch(isCheckedPolicy, (newValue) => {
  isButtonDisabled.value = !newValue
})

const {submitOtoBanner} = useOtoBanner()

// Обработчик смены страны
const handleCountryChange = (country: Country) => {
  selectedCountry.value = country;
};

const send = async () => {
  const {isFormError, validateForm, resetErrors, resetForm} = useFormValidator(form)
  resetErrors()
  validateForm()

  if (isFormError.value) {
    return
  }

  // Дополнительная валидация длины телефона
  if (getInputType() === 'tel' && selectedCountry.value) {
    const {validatePhoneLength} = usePhoneMask();
    const isPhoneValid = validatePhoneLength(
        form.value.input_field_value.value,
        selectedCountry.value.phone_code,
        selectedCountry.value.phone_length
    );

    if (!isPhoneValid) {
      form.value.input_field_value.error = `Номер должен содержать ${selectedCountry.value.phone_length} цифр`;
      return;
    }
  }

  isLoading.value = true

  const inputValue = form.value.input_field_value.value

  const data = {
    input_field_value: inputValue,
    email: getInputType() == 'email' ? inputValue : null,
    phone: getInputType() == 'tel' ? inputValue : null,
  }

  const result = await submitOtoBanner(data)

  isLoading.value = false

  if (result.success) {
    resetErrors()
    resetForm()


  } else if (result.error?.data?.errors) {
    const errors = result.error.data.errors

    // input_field_value (если вдруг бэк вернул его)
    if (errors.input_field_value?.[0]) {
      form.value.input_field_value.error = errors.input_field_value[0]
      return
    }

    // email -> показываем в input_field_value
    if (errors.email?.[0] && getInputType() === 'email') {
      form.value.input_field_value.error = errors.email[0]
      return
    }

    // phone -> показываем в input_field_value
    if (errors.phone?.[0] && getInputType() === 'tel') {
      form.value.input_field_value.error = errors.phone[0]
      return
    }
  }

}

/**
 * Определить компонент для поля ввода
 */
const getInputComponent = () => {
  // FormPhoneWithCountry обрабатывается отдельно в template
  return FormInput
}

/**
 * Определить тип input
 */
const getInputType = () => {
  const type = banner?.value.input_field_type
  if (type === 'email') return 'email'
  if (type === 'phone') return 'tel'
  return 'text'
}
</script>

<style scoped lang="scss">
.modal-oto {
  max-width: 80rem;

  @media (max-width: $tablet) {
    max-width: 60rem;
  }

  @media (max-width: $mobile) {
    max-width: 100%;
  }
}

.modal-oto__image {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: .8rem;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: $mobile) {
    margin-bottom: 1.5rem;
  }
}

.modal-oto__content {
  text-align: center;
}

.modal-oto__title {
  margin-bottom: 1rem;
  font-size: 3.2rem;
  line-height: 110%;
  font-weight: 700;

  @media (max-width: $tablet) {
    font-size: 2.8rem;
  }

  @media (max-width: $mobile) {
    font-size: 2.4rem;
    margin-bottom: 0.8rem;
  }
}

.modal-oto__subtitle {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  line-height: 140%;
  color: var(--fg-gray);

  @media (max-width: $tablet) {
    font-size: 1.6rem;
  }

  @media (max-width: $mobile) {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
}

.modal-oto__form {
  max-width: 42rem;
  margin: 0 auto;

  & .form__button {
    margin-top: 0;
  }

  @media (max-width: $mobile) {
    max-width: 100%;
  }
}

.modal-oto__checkboxes {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;

  @media (max-width: $mobile) {
    margin-top: 1rem;
    gap: 0.8rem;
  }
}

.form__policy {
  margin: 0;
}

.modal-oto__privacy {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;

  @media (max-width: $mobile) {
    font-size: 1.1rem;
    margin-top: 1rem;
  }
}
</style>