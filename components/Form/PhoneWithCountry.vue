<template>
  <div class="form__row phone-with-country z-20" :class="rowClass">
    <div class="phone-input">
      <!-- Селект выбора страны -->
      <div class="phone-input__select-wrapper">
        <FormSelect
            optionLabel="phone_code"
            :list="formattedCountries"
            :placeholder="selectPlaceholder"
            :selected-id="defaultCountryId"
            @get-selected-value="handleCountrySelect"
        />
      </div>

      <!-- Поле ввода телефона -->
      <input
          :type="type"
          :name="name"
          class="phone-input__field"
          :placeholder="placeholder"
          v-model="phoneValue"
          v-mask="currentMask"
          @input="handleInput"
          :autocomplete="autocomplete"
      >
    </div>

    <div class="form__error" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import type {Country} from '~/types/countries';
import FormSelect from '~/components/Form/Select.vue';

const props = withDefaults(defineProps<{
  type?: string;
  name?: string;
  placeholder?: string;
  rowClass?: string;
  autocomplete?: string;
  error?: string;
  countries: Country[];
  defaultCountryId?: number;
}>(), {
  type: 'tel',
  autocomplete: 'off',
  error: '',
  placeholder: 'Номер телефона',
  defaultCountryId: 0
});


const emit = defineEmits(['update:modelValue', 'countryChanged']);
const model = defineModel<string>();

const phoneValue = ref('');
const selectedCountry = ref<Country | null>(null);

const {generateMask} = usePhoneMask();

// Форматируем список стран для dropdown - полное название
const formattedCountries = computed(() => {
  return props.countries.map(country => ({
    ...country,
    name: `${country.name} (${country.phone_code})`
  }));
});

// Placeholder - только код страны
const selectPlaceholder = computed(() => {
  return selectedCountry.value?.phone_code || '+7';
});

const currentMask = computed(() => {
  if (!selectedCountry.value) return '(###) ###-##-##';
  const mask = generateMask(selectedCountry.value.phone_code, selectedCountry.value.phone_length);
  return mask.replace(selectedCountry.value.phone_code, '').trim();
});

onMounted(() => {
  const defaultCountry = props.countries.find(c => c.id === props.defaultCountryId);
  if (defaultCountry) {
    selectedCountry.value = defaultCountry;
  }

  // Инициализация из v-model
  if (model.value && selectedCountry.value) {
    const phoneWithoutCode = model.value.replace(selectedCountry.value.phone_code, '').trim();
    phoneValue.value = phoneWithoutCode;
  }
});

// Следим за изменениями v-model извне
watch(() => model.value, (newValue) => {
  if (newValue && selectedCountry.value && !phoneValue.value) {
    const phoneWithoutCode = newValue.replace(selectedCountry.value.phone_code, '').trim();
    phoneValue.value = phoneWithoutCode;
  }
});

const handleCountrySelect = (data: any) => {
  const country = props.countries.find(c => c.id === data.id);
  if (country) {
    selectedCountry.value = country;
    phoneValue.value = '';
    model.value = '';
    emit('countryChanged', country);

    // Принудительно обновляем отображение только кода
    nextTick(() => {
      const selectBtn = document.querySelector('.phone-input__select-wrapper .select__result span');
      if (selectBtn) {
        selectBtn.textContent = country.phone_code;
      }
    });
  }
};

const handleInput = () => {
  if (selectedCountry.value) {
    model.value = selectedCountry.value.phone_code + ' ' + phoneValue.value;
  }
};
</script>

<style scoped lang="scss">
.phone-with-country {
  .phone-input {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
  }

  .phone-input__select-wrapper {
    flex-shrink: 0;
    width: 8rem;
    position: relative;
    z-index: 10;

    :deep(.select) {
      position: static;
    }

    :deep(.select__result) {
      min-height: 7rem;
      height: 7rem;
      border: 0.1rem solid var(--fg-input-border);
      border-right: none;
      border-radius: 6rem 0 0 6rem;
      padding: 0 0.5rem 0 2rem;
      width: 8rem;

      @media (max-width: $mobile) {
        min-height: 5rem;
        height: 5rem;
        width: 100%;
        padding: 0 0.5rem 0 1.5rem;
      }

      & span {
        font-size: 1.6rem;

        @media (max-width: $mobile) {
          font-size: 1.4rem;
        }
      }

      & svg {
        width: 1rem;
        right: 1rem;
      }
    }

    :deep(.select__list) {
      top: calc(100% + 0.5rem);
      left: 0;
      width: 32rem;

      @media (max-width: $mobile) {
        width: 28rem;
      }
    }

    :deep(.select__item) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .phone-input__field {
    flex: 1;
    height: 7rem;
    border: 0.1rem solid var(--fg-input-border);
    border-radius: 0 6rem 6rem 0;

    padding: 0 2.7rem 0 2rem;
    font-size: 1.6rem;
    font-family: var(--ff-regular);

    &::placeholder {
      color: var(--fg-input-plachoder);
    }

    @media (max-width: $mobile) {
      height: 5rem;
      font-size: 1.4rem;
      padding: 0 2rem 0 1.5rem;


    }
  }

  .form__error {
    margin-top: 0.8rem;
    font-size: 1.2rem;
    color: var(--fg-red);
  }
}
</style>