<template>
  <div class="quantity">
    <div class="quantity__title" v-if="withTitle">Количество:</div>
    <div class="quantity__flex">
      <button class="quantity__button" @click="minus">-</button>
      <input type="text" class="quantity__input" :value="value" readonly>
      <button class="quantity__button" @click="plus">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults( defineProps<{
  value?: number,
  withTitle?: boolean,
  isNullAccess: boolean,
}>(), {
  value: 1,
  withTitle: true,
  isNullAccess: true
} );

const emit = defineEmits(['getQuantity', 'setQuantityNull']);
const value = ref( props.value );

const minus = () => {
  if ( value.value < 2) {
    value.value = 1;

    if ( ! props.isNullAccess ){
      emit('setQuantityNull');
    }

    return false;
  }

  value.value -= 1;
}

const plus = () => {
  if ( value.value > 99 ){
    value.value = value.value;
    return false;
  }

  value.value += 1;
}

watch( value, ( newValue ) => {
  emit('getQuantity', newValue );
} );
</script>

<style scoped lang="scss">

</style>