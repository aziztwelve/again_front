<template>
  <div class="restock form">
    <div class="restock__subtitle">Мы уведомим вас, когда товар появится в наличии</div>

    <!-- Мини-карточка товара -->
    <div class="restock__product" v-if="product">
      <div class="restock__product-image">
        <img v-if="productImage" :src="productImage" :alt="product.name">
      </div>
      <div class="restock__product-info">
        <div class="restock__product-name">{{ product.name }}</div>
        <span class="restock__product-badge">Нет в наличии</span>
      </div>
    </div>

    <!-- Поля -->
    <div class="restock__fields">
      <FormInput
          placeholder="Ваше имя"
          v-model="form.name.value"
          :error="form.name.error"
          row-class="_15"
      />

      <FormPhone
          placeholder="+7 (___) ___-__-__"
          v-model="form.phone.value"
          :error="form.phone.error"
          row-class="_15"
      />

      <FormInput
          type="email"
          placeholder="Эл. почта"
          v-model="form.email.value"
          :error="form.email.error"
          row-class="_15"
      />
    </div>

    <FormCheckbox
        class="restock__consent"
        name="restock_consent"
        :label="consentLabel"
        v-model="isConsent"
    />

    <div class="restock__bottom">
      <button
          class="restock__btn btn _wide _loader"
          :class="{ '_load': isLoading }"
          :disabled="!isConsent || isLoading"
          @click="submit"
      >
        Подписаться
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FormInput, FormPhone, FormCheckbox} from "#components";
import type {Product} from "~/types/catalog";

const asideMenuStore = useAsideMenuStore();
const {show: showToast} = useToast();

const product = computed<Product | undefined>(() => asideMenuStore.props?.product);
const variation = computed<any>(() => asideMenuStore.props?.variation);

const productImage = computed(() => {
  const img = product.value?.main_image as any;
  if (!img) return null;

  return img.url || (img.path ? getImage(img.path) : null);
});

const consentLabel =
    'Я соглашаюсь на получение информационных и рекламных сообщений от Again и подтверждаю ' +
    'ознакомление с <a href="/marketing-consent" target="_blank">электронным согласием на рассылку</a>';

const form = ref({
  name: {value: '', error: ''},
  phone: {value: '', error: ''},
  email: {value: '', error: ''},
});

const isConsent = ref(false);
const isLoading = ref(false);

const resetErrors = () => {
  form.value.name.error = '';
  form.value.phone.error = '';
  form.value.email.error = '';
};

const submit = async () => {
  if (!isConsent.value || isLoading.value) return;

  resetErrors();

  // Минимальная клиентская валидация — email обязателен (#1).
  const email = form.value.email.value.trim();
  if (!email) {
    form.value.email.error = 'Укажите эл. почту';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    form.value.email.error = 'Некорректный адрес эл. почты';
    return;
  }

  if (!product.value?.id) return;

  isLoading.value = true;

  const {status, error} = await useApi('/public/restock-subscriptions', {
    body: {
      product_id: product.value.id,
      product_variant_id: variation.value?.id ?? null,
      name: form.value.name.value || null,
      phone: form.value.phone.value || null,
      email,
      consent: isConsent.value,
    }
  }, undefined, 'POST');

  isLoading.value = false;

  if (status.value === 'error') {
    const errors = (error?.value as any)?.data?.errors;
    if (errors) {
      for (const key in errors) {
        if (form.value[key as keyof typeof form.value]) {
          form.value[key as keyof typeof form.value].error = errors[key][0];
        }
      }
    }
    return;
  }

  asideMenuStore.close();
  showToast('Мы сообщим вам о поступлении');
};
</script>

<style scoped lang="scss">
.restock {
  display: flex;
  flex-direction: column;
  height: auto;
}

.restock__subtitle {
  font-size: 1.6rem;
  line-height: 140%;
  color: var(--fg-gray);
  margin-bottom: 1.6rem;

  @media (max-width: $mobile) {
    font-size: 1.4rem;
  }
}

.restock__product {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background: var(--bg-light, #f5f3f2);
  border-radius: 1.2rem;
  margin-bottom: 1.8rem;
}

.restock__product-image {
  width: 6rem;
  height: 7.8rem;
  flex-shrink: 0;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--fg-white);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.restock__product-name {
  font-size: 1.6rem;
  line-height: 130%;
  font-weight: 600;
  margin-bottom: .8rem;
}

.restock__product-badge {
  display: inline-block;
  font-size: 1.2rem;
  color: var(--fg-red);
  background: rgba(203, 11, 19, .08);
  border-radius: .6rem;
  padding: .4rem 1rem;
}

.restock__fields {
  display: flex;
  flex-direction: column;
}

.restock__consent {
  margin-top: 1.4rem;
}

.restock__bottom {
  margin-top: 1.8rem;
}

.restock__btn {
  width: 100%;
}
</style>
