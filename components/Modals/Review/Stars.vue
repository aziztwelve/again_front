<template>
  <div class="modal-review__stars" ref="refStars">
    <div class="modal-review__stars-title">Выберите количество звезд</div>
    <div class="modal-review__stars-list">
      <div
          class="modal-review__stars-item"
          v-for="(star, key) in stars"
          :key="key"
          :data-value="star"
          ref="refItems"
          @click="setStars( key, star )"
      >
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.56555 0.724223C7.75757 0.398834 8.22829 0.398835 8.42031 0.724224L10.6122 4.4385C10.682 4.55679 10.7977 4.64086 10.9318 4.6707L15.1416 5.60753C15.5104 5.6896 15.6559 6.13728 15.4057 6.42046L12.5506 9.65284C12.4596 9.75578 12.4155 9.8918 12.4285 10.0285L12.8384 14.3218C12.8743 14.6979 12.4935 14.9746 12.1469 14.8242L8.19044 13.1077C8.06444 13.053 7.92142 13.053 7.79541 13.1077L3.83894 14.8242C3.49234 14.9746 3.11151 14.6979 3.14742 14.3218L3.55735 10.0285C3.57041 9.8918 3.52621 9.75578 3.43528 9.65284L0.58012 6.42045C0.329993 6.13728 0.475456 5.6896 0.844257 5.60753L5.05408 4.6707C5.18815 4.64086 5.30386 4.55679 5.37366 4.4385L7.56555 0.724223Z" fill="#EEEEEE"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const refStars = ref( null );
const refItems = ref( [] );
const stars = ref( [ 1, 2, 3, 4, 5 ] );
const emit = defineEmits(['setStars']);

const resetStars = () => {
  refItems.value.forEach( ( item ) => {
    item.classList.remove( '_active' );
  } )
}

const countStars = () => {
  const starsItemsActive = refStars.value.querySelectorAll( ".modal-review__stars-item._active" );
  if ( ! starsItemsActive ){
    return;
  }

  return starsItemsActive.length;
}

const setStars = ( index: number, value: number ) => {
  resetStars();

  const nextSiblings = refItems.value.slice( index + 1 );
  nextSiblings.forEach( ( next ) => {
    next.classList.add( '_active' );
  } );

  refItems.value[index].classList.add( '_active' );
  emit( 'setStars', countStars() );
}

</script>


<style scoped lang="scss">
.modal-review__stars {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.9rem;

  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: center;
  }
}

.modal-review__stars-title {
  font-size: 1.3rem;
  color: rgba(0,0,0,.29);

  @media (max-width: $mobile) {
    order: 2;
    font-size: 1.2rem;
  }
}

.modal-review__stars-list {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  @media (max-width: $mobile) {
    order: 1;
    margin-bottom: .424rem;
  }
}

.modal-review__stars-item {
  cursor: pointer;
  margin-right: .239rem;

  &:last-child {
    margin-right: 0;
  }

  & path {
    transition: var(--tr-regular);
  }

  &._active {
    & path {
      fill: #F7BB2B;
    }
  }

  &:hover {
    & path {
      fill: #F7BB2B;
    }
  }

  &:hover ~ & {
    & path {
      fill: #F7BB2B;
    }
  }
}
</style>