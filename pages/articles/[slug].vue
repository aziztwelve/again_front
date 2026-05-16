<template>
  <Breadcrumbs />
  <div class="news-article">
    <div class="news-article__container container">
      <div class="news-article__block">
        <div class="news-article__banner">
          <img
              :src="post?.banner"
              :alt="post?.title"
              class="news-article__banner-img"
              loading="eager"
          />
        </div>
        <div class="news-article__date">{{ post?.date }}</div>
        <h1 class="news-article__title fz-h2">{{ post?.title }}</h1>
        <div class="news-article__content text__content" v-html="post?.text.full"></div>
      </div>
    </div>
  </div>

  <NewsRelations />
</template>

<script setup lang="ts">
const route = useRoute();
const post = blogQuery().getBySlug(route.params.slug as string);

// Если статья не найдена, редирект на 404
if (!post) {
  throw createError({
    statusCode: 404,
    message: 'Статья не найдена'
  });
}
</script>

<style scoped lang="scss">
.news-article__block {
  background-color: var(--bg-dark);
  border: .1rem solid var(--br-dark);
  padding: 4.9rem 7.6rem 7.5rem 7.4rem;

  @media (max-width: $mobile) {
    padding: 1.7rem 1.5rem 2rem;
  }
}

.news-article__banner {
  margin: 0 0 2rem;
  width: 100%;
  max-height: 50rem;
  overflow: hidden;
  border-radius: .8rem;

  @media (max-width: $mobile) {
    margin: 0 0 1.5rem;
    max-height: 30rem;
  }
}

.news-article__banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.news-article__date {
  font-size: var(--fz-secondary);
  line-height: 140%;
  margin-bottom: 1rem;
  color: var(--fg-black);
  opacity: .3;

  @media (max-width: $mobile) {
    margin-bottom: .8rem;
  }
}

.news-article__title {
  margin: 0 0 3rem;
  line-height: 100%;

  @media (max-width: $mobile) {
    line-height: 130%;
    margin: 0 0 1.2rem;
  }
}

.text__content > *:not(h1,h2,h3,h4,h5,h6) {
  font-size: var(--fz-regular);
  line-height: 150%;
  margin-bottom: 2rem;

  @media (max-width: $mobile) {
    margin-bottom: 1.4rem;
    --fz-regular: 1.4rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.text__content {
  & h2, & h3, & h4, & h5, & h6 {
    margin: 4rem 0 1.2rem;

    @media (max-width: $mobile) {
      margin: 2.9rem 0 1.5rem;
    }
  }

  & img {
    width: 100%;
    height: auto;
    margin: 3rem 0;
    border-radius: .8rem !important;

    @media (max-width: $mobile) {
      margin: 2rem 0;
    }
  }

  & ol li {
    list-style-position: outside;
  }

  & ul li {
    list-style: disc;
  }

  & ul,
  & ol {
    padding-left: 2rem;
  }

  & ul li,
  & ol li {
    line-height: 150%;
    margin-bottom: 1.8rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  & a {
    color: var(--fg-red);
    text-decoration: underline;
    transition: var(--tr-regular);

    @media(any-hover: hover) {
      &:hover {
        color: var(--bg-button-primary-hover);
      }
    }
  }

  & strong {
    font-weight: 700;
  }
}

.text__content ol li {
  list-style-position: outside;
}

.news__related {
  padding-bottom: 7rem;
}
</style>