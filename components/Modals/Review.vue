<template>
  <div class="modal-review__title modal__title">Оставьте свой отзыв</div>
  <div class="modal-review__form form" v-if="auth.isAuthenticated">
    <div class="modal-review__grid">
      <div class="modal-review__col">
        <ModalsReviewStars @set-stars="getStarSelected" />

        <FormTextarea
            row-class="_15"
            name="comment"
            placeholder="Напишите отзыв*"
            v-model="form.message"
            maxlength="200"
        />

        <!-- Счётчик символов -->
        <div class="modal-review__counter">
          {{ form.message.length }} / 200
        </div>

      </div>
    </div>
    <div class="modal-review__actions">
      <div class="modal-review__form-text">Перед публикацией отзывы проходят модерацию</div>
      <button class="modal-review__form-btn btn" @click="submit">Оставить отзыв</button>
    </div>
  </div>
  <div v-else class="modal-review__message">
    <NuxtLink to="/login" @click="modal.closeModal()">Авторизруйтесь</NuxtLink>, чтобы оставить отзыв
  </div>
</template>

<script setup lang="ts">
import {ModalsSuccess} from "#components";

const form = ref( {
  message: '',
  rating: 5
} );

const auth  = useAuthStore();
const modal = useModal();
const getStarSelected = ( value: number ) => {
  form.value.rating = value;
};

const submit = async () => {
  const { data, status } = await useApi( '/reviews', {
    body: {
      reviewable_id: modal.props.productId,
      reviewable_type: 'Product',
      content: form.value.message,
      rating: form.value.rating
    }
  }, '', 'POST' );

  if ( status.value === 'success' ){
    modal.openModal( ModalsSuccess, {
      customClass: 'success',
      text: 'Ваш отзыв будет добавлен после проверки'
    } )
  }
}
</script>

<style scoped lang="scss">


.modal-review__counter {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #999;
  text-align: right;
}

.modal-review__title {
  text-align: center;
  margin-bottom: 6.4rem;

  @media (max-width: $mobile) {
    margin-bottom: 1.6rem;
  }
}

.modal-review__grid {
  //display: grid;
  //grid-template-columns: repeat(2, 1fr);
  //gap: 2.2rem;
  //
  //@media (max-width: $mobile) {
  //  grid-template-columns: 1fr;
  //  gap: 1.5rem;
  //}
}

.modal-review__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.1rem;

  @media (max-width: $mobile) {
    flex-wrap: wrap;
    text-align: center;
    margin-top: 1.5rem;
  }
}

.modal-review__form-text {
  font-size: 1.2rem;
  color: #464646;
  opacity: .5;

  @media (max-width: $mobile) {
    order: 2;
    max-width: 21.2rem;
    margin: 1.4rem auto 0;
  }
}

.modal-review__form-btn {
  margin: 0;
  max-width: 36.6rem;

  @media (max-width: $mobile) {
    order: 1;
    max-width: 100%;
  }
}

.modal-review__message {
  text-align: center;

  & a {
    color: var(--fg-red);
    text-decoration: underline;
  }
}
</style>