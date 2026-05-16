<template>
  <div class="recommend-item">
    <div class="recommend-item__media">
      <picture class="recommend-item__media-pic">
        <img :src="image" class="recommend-item__media-img" :alt="name">
      </picture>
    </div>
    <div class="recommend-item__content">
      <div class="recommend-item__name fz-h3">{{ name }}</div>
      <div class="recommend-item__post">{{ post }}</div>
      <!--    <div class="recommend-item__text">-->
      <!--      @@text-->
      <!--    </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string,
  name: string,
  post: string
}>();
</script>

<style scoped lang="scss">
.recommend-item {
  //display: flex;
  //align-items: flex-start;
  //
  //@media (max-width: $mobile) {
  //  flex-direction: column;
  //}
}

.recommend-item__media-pic {
  min-height: 30rem;
  position: relative;
  //border-radius: 50%;
  overflow: hidden;
  border-radius: 2rem;

  @media (max-width: $mobile) {
    min-height: auto;
    padding-bottom: 100%;
  }
}

.recommend-item__media-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.recommend-item__content {
  //margin-left: 2rem;
  padding-top: 2rem;

  @media (max-width: $mobile) {
    //margin-left: 0;
    //margin-top: 1.3rem;
  }
}

.recommend-item__name {
  margin-bottom: .7rem;

  @media (max-width: $mobile) {
    font-size: 2rem;
    line-height: 100%;
    margin-bottom: .5rem;
  }
}

.recommend-item__post {
  opacity: .5;
  line-height: 140%;
  font-size: var(--fz-secondary);
  margin-bottom: .7rem;

  @media (max-width: $mobile) {
    margin-bottom: .5rem;
  }
}

.recommend-item__text {
  font-size: var(--fz-secondary);
  line-height: 140%;
  max-width: 36rem;
}

</style>