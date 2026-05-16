<template>
  <section class="recommend">
    <div class="recommend__container container">
      <div class="recommend-block__header block__header">
        <div class="block__header-title">Врачи рекомендуют</div>
      </div>

      <ClientOnly>
        <swiper-container
            class="recommend__swiper swiper"
            :slidesPerView="1.2"
            :spaceBetween="20"
            :pagination="{ clickable: true }"
            :modules="[Pagination, Autoplay]"
            :autoplay="{ delay: 5000 }"
            :breakpoints="{
              0: { slidesPerView: 1.2, spaceBetween: 15 },
              600: { slidesPerView: 2.5, spaceBetween: 20,  },
              992: { slidesPerView: 4, spaceBetween: 30 }
            }"
        >
          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-1.jpg"
                name="ГПарфенова Майя Александровна"
                post="Врач-дерматовенеролог, косметолог, кандидат медицинских наук. Член научно-практического общества врачей-дерматовенерологов г. Санкт-Петербурга им. В.М. Тарновского"
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-2.png"
                name="Гридасова Ольга Сергеевна"
                post="Врач с мировым опытом, ученый, кандидатская диссертация по теме «САВЛ лихен вульвы»"
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-3.png"
                name="Садовская Дарья Сергеевна"
                post="Врач, к.м.н., нефролог, иммунолог"
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-4.jpg"
                name="Чепуштанова Ксения Олеговна"
                post="Врач-дерматолог с 8 летним стажем. Более 7000 пациентов по миру."
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-5.jpg"
                name="Аракелян Лилит Лерниковна"
                post="Врач-инфекционист, педиатр. Участница программ на федеральных ТВ каналах."
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-6.jpg"
                name="Тарайкович Анна Александровна"
                post="Детский эндокринолог. Врач высшей категории. Соорганизатор крупнейшего эндокринологического сообщества в СНГ."
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-7.jpg"
                name="Архангельская Мария Владимировна"
                post="Врач ультразвуковой диагностики (УЗИ). Экспертные исследования органов и систем."
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-8.jpg"
                name="Кляус Наталия Андреевна"
                post="Врач-ревматолог, врач по лечебной физкультуре. Спикер международных конференций."
            />
          </swiper-slide>

          <swiper-slide>
            <RecommendCard
                image="/img/recommend.again/item-9.jpg"
                name="Васильев Никита Олегович"
                post="Врач-уролог, нейроуролог."
            />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { register } from 'swiper/element/bundle';
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

register();
</script>

<style scoped lang="scss">
.recommend {
  padding: 7rem 0 5.2rem;
  border-radius: 12rem;
  background: #F3F4F8;

  @media (max-width: $tablet) {
    border-radius: 6rem;
  }

  @media (max-width: $mobile) {
    border-radius: 2rem;
    padding: 5rem 0;
  }
}

.recommend__swiper {
  margin-top: 3rem;

  @media (max-width: $mobile) {
    margin-top: 2rem;
  }
}

// Pagination (точки) - показываем только на мобилке
swiper-container::part(pagination) {
  margin-top: 3rem;
  position: relative;

  @media (max-width: $mobile) {
    display: flex;
  }
}


</style>