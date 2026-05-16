<template>
  <div class="filter-absorbency">
    <button
        v-for="level in absorbencyLevels"
        :key="level.value"
        type="button"
        class="filter-absorbency__item"
        :class="{ '_active': selectedLevel === level.value }"
        @click="selectLevel(level.value)"
    >
      <span class="filter-absorbency__label">{{ level.label }}</span>

      <!--      <span class="filter-absorbency__drops" aria-hidden="true">-->
      <!--        <svg-->
      <!--            class="filter-absorbency__drop-icon"-->
      <!--            viewBox="0 0 35 53"-->
      <!--            fill="none"-->
      <!--            xmlns="http://www.w3.org/2000/svg"-->
      <!--        >-->
      <!--          <path-->
      <!--              d="M17.5 2.44238C17.9642 3.22192 18.5965 4.2922 19.3438 5.5791C20.9647 8.37082 23.1253 12.1781 25.2842 16.2441C27.4447 20.3133 29.5956 24.6268 31.2041 28.4336C32.0084 30.3371 32.6709 32.0998 33.1309 33.6328C33.5953 35.181 33.8339 36.4317 33.834 37.333C33.834 45.0358 26.6503 51.5 17.5 51.5C8.3499 51.4998 1.16699 45.0357 1.16699 37.333C1.16705 36.4317 1.40466 35.181 1.86914 33.6328C2.3291 32.0997 2.99251 30.3372 3.79688 28.4336C5.40542 24.6268 7.55625 20.3133 9.7168 16.2441C11.8757 12.1782 14.0363 8.37079 15.6572 5.5791C16.4043 4.29242 17.0359 3.22186 17.5 2.44238Z"-->
      <!--              stroke="#CB0B13"-->
      <!--              stroke-width="2"-->
      <!--              fill="#CB0B13"-->
      <!--          />-->
      <!--        </svg>-->
      <!--      </span>-->


      <span class="filter-absorbency__drops" aria-hidden="true">
          <svg
              class="filter-absorbency__drop-icon"
              viewBox="0 0 35 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
      <path
          d="M17.5 2.44238C17.9642 3.22192 18.5965 4.2922 19.3438 5.5791C20.9647 8.37082 23.1253 12.1781 25.2842 16.2441C27.4447 20.3133 29.5956 24.6268 31.2041 28.4336C32.0084 30.3371 32.6709 32.0998 33.1309 33.6328C33.5953 35.181 33.8339 36.4317 33.834 37.333C33.834 45.0358 26.6503 51.5 17.5 51.5C8.3499 51.4998 1.16699 45.0357 1.16699 37.333C1.16705 36.4317 1.40466 35.181 1.86914 33.6328C2.3291 32.0997 2.99251 30.3372 3.79688 28.4336C5.40542 24.6268 7.55625 20.3133 9.7168 16.2441C11.8757 12.1782 14.0363 8.37079 15.6572 5.5791C16.4043 4.29242 17.0359 3.22186 17.5 2.44238Z"
          stroke="#CB0B13"
          stroke-width="2"
          :fill="level.value === 0 ? 'none' : '#CB0B13'"
      />
      </svg>
  </span>


    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select-absorbency', value: number | null): void
}>()

const selectedLevel = ref<number | null>(null)

// 0 = "без" (сбрасывает фильтр), дальше 2–6
const absorbencyLevels = [
  {value: 0, label: ''},
  {value: 2, label: '2'},
  {value: 3, label: '3'},
  {value: 4, label: '4'},
  {value: 5, label: '5'},
  {value: 6, label: '6'},
]

// "без" должен показывать 1 каплю, остальные — по числу
const dropsCount = (value: number) => (value === 0 ? 1 : value)

const selectLevel = (level: number) => {
  // повторный клик — снять выбор
  if (selectedLevel.value === level) {
    selectedLevel.value = null
    emit('select-absorbency', null)
    return
  }

  selectedLevel.value = level

  // "без" = не фильтруем (null)
  if (level === 0) {
    emit('select-absorbency', null)
  } else {
    emit('select-absorbency', level)
  }
}

// Сброс фильтра извне
defineExpose({
  reset: () => {
    selectedLevel.value = null
  }
})
</script>

<style scoped lang="scss">


/* 3 в ряд на мобиле, 2 в ряд на совсем узких можно оставить 3 — оно компактно */
.filter-absorbency {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .8rem;
}

/* компактная кнопка */
.filter-absorbency__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;

  padding: .85rem .8rem;
  border: 1px solid #E3E3E3;
  border-radius: .8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--fg-white);

  /* чтобы не раздувалось по высоте */
  min-height: 4.0rem;
}

.filter-absorbency__item:hover {
  border-color: var(--bg-filter-button);
  background: rgba(var(--bg-filter-button-rgb), 0.05);
}

.filter-absorbency__item._active {
  border-color: var(--bg-filter-button);
  background: var(--bg-filter-button);
  color: var(--fg-white);
}

/* label короткий: без / 2 / 3 ... */
.filter-absorbency__label {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
}

/* капли в одну линию и маленькие */
.filter-absorbency__drops {
  display: flex;
  align-items: center;
  gap: .20rem;
}

.filter-absorbency__drop-icon {
  width: 1.05rem;
  height: auto;
  padding-bottom: 0.02rem;
}

/* чтобы капли не исчезали на активном фоне */
.filter-absorbency__item._active .filter-absorbency__drop-icon path {
  stroke: #fff;
  fill: #fff;
}

/* если у тебя бывают очень узкие экраны, можно сделать 2 в ряд */
@media (max-width: 360px) {
  .filter-absorbency {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
