<template>
  <div class="filter__price-flex">
    <div class="filter__price-value filter__price-before">
      от&nbsp;<span><span class="filter__price-result">{{ getFormatPrice().formattedPrice( sliderBefore ) }}</span> ₽</span>
    </div>
    <div class="filter__price-value filter__price-after">
      до&nbsp;<span><span class="filter__price-result">{{ getFormatPrice().formattedPrice( sliderAfter ) }}</span> ₽</span>
    </div>
  </div>
  <div class="filter__price-input" ref="sliderRef"></div>
</template>

<script setup lang="ts">
import noUiSlider from 'nouislider';

const sliderRef: Ref = ref( null );
const sliderBefore: Ref = ref( 0 );
const sliderAfter: Ref = ref( 20000 );

let initSlider = null;

const emit = defineEmits(['selectPrices']);

onMounted( () => {
  initSlider = noUiSlider.create(sliderRef.value, {
    range: {
      'min': 0,
      'max': 20000
    },
    start: [1000, 6000],
    connect: true,
    step: 100,
  });

  initSlider.on('update', (values, handle) => {
    const value = values[handle];

    if ( handle ){
      sliderAfter.value = Number( value );
    } else {
      sliderBefore.value = Number( value );
    }

    emit('selectPrices', {
      before: sliderBefore.value,
      after: sliderAfter.value,
    });
  });
} )
</script>

<style scoped lang="scss">
.filter__price-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.1rem;
}

.filter__price-value {
  width: 10rem;
  height: 3rem;
  background: var(--fg-white);
  border-radius: 1.3rem;
  font-size: 1.3rem;
  padding: .2rem .7rem;
  display: flex;
  align-items: center;
}

.filter__price-input {
  background: #595959;
  border-radius: 0;
  box-shadow: none;
  border: none;

  &.noUi-target,
  & :deep(.noUi-connects),
  & :deep(.noUi-connect) {
    height: .1rem;
  }

  & :deep(.noUi-connect) {
    background: var(--fg-red);
  }

  & :deep(.noUi-handle) {
    width: 1.2rem !important;
    height: 1.2rem !important;
    border-radius: 50%;
    background: var(--fg-white);
    border: .2rem solid var(--fg-red);
    right: -1.2rem;
    box-shadow: none;

    &:before,
    &:after {
      display: none;
    }
  }
}

@media (max-width: $tablet) {
  .filter__price-value {
    border: .1rem solid #E3E3E3;
  }
}
</style>