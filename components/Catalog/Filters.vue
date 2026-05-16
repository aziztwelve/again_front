<template>
  <div class="filter">
    <div class="filter__title fz-h4" @click="toggleTabletFilter">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.35859 0.226991C7.58633 0.391741 6.94019 0.965794 6.69822 1.7046L6.65446 1.83846L3.50618 1.84361L0.357896 1.85133L0.24463 1.92855C-0.105465 2.17568 -0.0745743 2.7034 0.303837 2.89646C0.399084 2.9428 0.484033 2.94537 3.5242 2.94537H6.64673L6.71881 3.14874C6.94534 3.7923 7.48078 4.29684 8.16553 4.51565C8.4075 4.59288 8.97898 4.61605 9.24928 4.55942C10.1013 4.37922 10.7732 3.70735 10.9611 2.85528C11.01 2.63132 11.0023 2.09588 10.9483 1.88994C10.8299 1.4343 10.6702 1.15629 10.3433 0.834508C10.019 0.515304 9.76927 0.371148 9.3471 0.252733C9.13858 0.1961 8.5774 0.180655 8.35859 0.226991ZM9.23898 1.41114C9.46294 1.51668 9.65343 1.70717 9.76412 1.92855C10.0833 2.57469 9.68947 3.32893 8.95581 3.46537C8.55681 3.54002 8.078 3.30577 7.85919 2.9325C7.52454 2.36103 7.80513 1.60935 8.44354 1.37252C8.64948 1.2953 9.04076 1.31331 9.23898 1.41114Z"
            fill="#343434"/>
        <path
            d="M1.72855 4.62875C0.915098 4.81667 0.281838 5.42419 0.0656033 6.22992C-0.00904929 6.50536 -0.0141977 7.04595 0.0527322 7.30337C0.16085 7.71525 0.3256 8.01386 0.603617 8.30475C1.66935 9.41939 3.4919 9.14652 4.17922 7.77188C4.22298 7.68693 4.27704 7.55565 4.30021 7.48357L4.34654 7.34713L7.49482 7.34199L10.6431 7.33426L10.7564 7.25704C11.1039 7.00991 11.073 6.48219 10.6972 6.2917C10.6019 6.24022 10.5324 6.24022 7.4768 6.24022H4.35427L4.28991 6.05487C4.0711 5.41131 3.52279 4.89132 2.83547 4.66994C2.60637 4.59528 1.97311 4.57212 1.72855 4.62875ZM2.41587 5.72794C3.10577 5.8721 3.4816 6.6315 3.1727 7.25704C3.062 7.47842 2.87151 7.66891 2.64755 7.77446C2.45449 7.8697 2.10182 7.8903 1.8933 7.82337C1.46083 7.68436 1.16222 7.30595 1.13133 6.86318C1.09529 6.33289 1.4248 5.8824 1.95509 5.73824C2.12241 5.69448 2.24083 5.69191 2.41587 5.72794Z"
            fill="#343434"/>
      </svg>
      <span>Фильтры</span>
    </div>
    <div class="filter__view" :class="{ '_active': isActive }">
      <div class="filter__view-bg filter--close"></div>
      <div class="filter__view-block">
        <div class="filter__view-header">
          <div class="filter__view-title">Фильтры</div>
          <button class="filter__view-close  filter--close" @click="toggleTabletFilter">
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.3">
                <path
                    d="M0.277349 0.558003C0.0972205 0.647033 0.00405057 0.808527 0.00405057 1.02592C0.00405057 1.11081 0.0185437 1.18949 0.0475299 1.24953C0.0785865 1.322 0.581704 1.83547 2.3188 3.57257L4.54867 5.8045L2.31052 8.04472C-0.176078 10.5355 -0.00837208 10.3471 0.00819145 10.6245C0.0226845 10.904 0.204883 11.0862 0.484393 11.1007C0.761832 11.1173 0.573422 11.285 3.06416 8.79836L5.30438 6.56022L7.54667 8.79836C10.0353 11.285 9.84693 11.1173 10.1244 11.1007C10.4039 11.0862 10.5861 10.904 10.6006 10.6245C10.6171 10.3471 10.7848 10.5355 8.29824 8.04679L6.06009 5.8045L8.29824 3.56222C10.7848 1.07354 10.6171 1.26195 10.6006 0.984515C10.5861 0.705006 10.4039 0.522806 10.1244 0.508313C9.84693 0.49175 10.0353 0.324044 7.5446 2.81065L5.30438 5.04879L3.07245 2.81893C1.33534 1.08183 0.821875 0.578709 0.74941 0.547651C0.61069 0.483468 0.416069 0.489679 0.277349 0.558003Z"
                    fill="black"/>
              </g>
            </svg>
          </button>
        </div>
        <div class="filter__row">

          <FilterBlock title="Цены:">
            <FilterPrice @select-prices="emitPrices"/>
          </FilterBlock>

          <FilterBlock
              title="Цвет:"
              v-if="colors && colors.success"
          >
            <FilterColor
                :colors="colors.colors"
                @select-color="emitColor"
            />
          </FilterBlock>


          <FilterBlock title="Впитываемость:">
            <FilterAbsorbency
                ref="absorbencyRef"
                @select-absorbency="emitAbsorbency"
            />
          </FilterBlock>

          <FilterBlock title="Посадка:">
            <FilterFitType
                ref="fitTypeRef"
                @select-fit-type="emitFitType"
            />
          </FilterBlock>

        </div>
        <button class="filter__submit" @click="emitSubmitFilter">Применить</button>

        <div class="filter__reset">
          <button
              :class="{ '_active': hasActiveFilters }"
              @click="emitResetFilter"
          >
            Сбросить фильтры
          </button>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Color} from "~/types/catalog"


type Colors = {
  success: boolean,
  colors?: [Color]
}

const isActive = ref(false)
const toggleTabletFilter = () => {
  isActive.value = !isActive.value
  lockUnlockBody().toggle()
}

const {data: colors} = await useApi<Colors>('/colors/used-in-catalog')
const emit = defineEmits(['selectPrices', 'selectColor', 'filterClick', 'resetClick'])

// Refs для сброса фильтров
const absorbencyRef = ref()
const fitTypeRef = ref()
const isNewRef = ref()

// Состояние фильтров
const prices = ref({})
const color = ref(0)
const absorbency = ref<number | null>(null)
const fitType = ref<string | null>(null)
const isNew = ref(false)

const emitPrices = (object: object) => {
  prices.value = object
}

const emitColor = (colorId: number) => {
  color.value = colorId
}

const emitAbsorbency = (level: number | null) => {
  absorbency.value = level
}

const emitFitType = (type: string | null) => {
  fitType.value = type
}

const emitIsNew = (value: boolean) => {
  isNew.value = value
}



const hasActiveFilters = computed(() => {
  return (
      // цена
      !!prices.value.before ||
      !!prices.value.after ||

      // цвет
      color.value !== 0 ||

      // впитываемость
      absorbency.value !== null ||

      // посадка
      fitType.value !== null ||

      // новинки
      isNew.value === true
  )
})



const emitSubmitFilter = () => {

  isActive.value = false
  lockUnlockBody().unlock() // Явно разблокируем

  emit('filterClick', {
    color: color.value,
    price: {
      before: prices.value.before,
      after: prices.value.after,
    },
    absorbency_level: absorbency.value,
    fit_type: fitType.value,
    is_new: isNew.value,
  })
}

const emitResetFilter = () => {
  // Сбрасываем все фильтры
  absorbencyRef.value?.reset()
  fitTypeRef.value?.reset()
  isNewRef.value?.reset()

  color.value = 0
  prices.value = {}
  absorbency.value = null
  fitType.value = null
  isNew.value = false


  isActive.value = false
  lockUnlockBody().unlock() // Явно разблокируем

  emit('resetClick')
}
</script>
<style scoped lang="scss">
.filter {
  padding: 2.5rem 2rem;
  border-radius: 3rem;
  background-color: var(--bg-filter);

  @media (max-width: $tablet) {
    padding: 0;
    border-radius: 0;
    background: none;
  }
}

.filter__title {
  margin-bottom: 2.1rem;
  display: flex;
  align-items: center;

  & svg {
    display: none;

    @media (max-width: $tablet) {
      display: block;
      margin-right: .5rem;
    }
  }

  @media (max-width: $tablet) {
    font-size: 1.4rem;
    font-weight: 700;
  }
}

.filter__view-header {
  display: none;

  @media (max-width: $tablet) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.3rem;
  }
}

.filter__view-title {
  @media (max-width: $tablet) {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--bg-filter-button);
  }
}

@media (max-width: $tablet) {
  .filter__view {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    transition: z-index .5s;
    pointer-events: none;

    &._active {
      pointer-events: auto;

      & .filter__view-bg {
        opacity: 1;
      }

      & .filter__view-block {
        transform: translateX(0);
        transition-delay: .2s;
      }
    }
  }

  .filter__view-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-modal-overlay);
    opacity: 0;
    transition: var(--tr-regular);
  }

  .filter__view-block {
    position: fixed;
    top: 0;
    right: 0;
    width: 32rem;
    height: 100%;
    background: var(--fg-white);
    z-index: 5;
    padding: 1rem 2rem;
    transition: var(--tr-regular);
    transform: translateX(100%);
  }
}

.filter__block {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter__block-title {
  margin-bottom: 1.6rem;
  font-size: 1.7rem;

  @media (max-width: $tablet) {
    font-size: var(--fz-secondary);
  }
}

.filter__size {
  & .filter__block-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1.7rem;
  }

  &-checkbox {
    & .checkbox__icon {
      border-color: var(--fg-white);
      background: var(--fg-white);

      @media (max-width: $tablet) {
        border-color: #E3E3E3;
      }
    }

    & .checkbox__label {
      font-size: 1.4rem;
    }
  }
}

.filter__submit {
  width: 100%;
  padding: 1.2rem 0;
  display: block;
  border: none;
  background-color: var(--bg-filter-button);
  color: var(--fg-white);
  border-radius: .926rem;
  margin-top: 3.2rem;
  font-size: 1.333rem;
  line-height: normal;
}

.filter__reset {
  text-align: center;
  margin-top: 1.2rem;

  button {
    display: inline-block;
    font-weight: 500;
    font-size: 1.343rem;
    padding-bottom: .459rem;
    border-bottom: .1rem dashed #C8C8C8;
    color: #343434;
  }
}

.filter__reset button._active {
  color: #E53935;
  border-bottom-color: #E53935;
}

.filter__reset button._active:hover {
  color: #C62828;
  border-bottom-color: #C62828;
}


.filter__price .filter__block-title {
  margin-bottom: 1.5rem;
}

</style>