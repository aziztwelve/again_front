<template>
  <div class="modal-sizes__title modal__title">Таблица размеров</div>
  <div class="modal-sizes__text">Таблица рекомендуемых размеров</div>
  <table class="modal-sizes__table">
    <thead>
    <th>Размер</th>
    <th>Размер</th>
    <th>Обхват талии</th>
    <th>Обхват бедер</th>
    </thead>
    <tbody>
    <tr>
      <td>XS</td>
      <td>40-42</td>
      <td>64-68</td>
      <td>88-92</td>
    </tr>
    <tr>
      <td>S</td>
      <td>42-44</td>
      <td>68-72</td>
      <td>92-96</td>
    </tr>
    <tr>
      <td>M</td>
      <td>44-46</td>
      <td>72-76</td>
      <td>96-102</td>
    </tr>
    <tr>
      <td>L</td>
      <td>46-48</td>
      <td>76-80</td>
      <td>102-108</td>
    </tr>
    <tr>
      <td>XL</td>
      <td>48-50</td>
      <td>80-84</td>
      <td>108-112</td>
    </tr>
    <tr>
      <td>2XL</td>
      <td>50-52</td>
      <td>84-88</td>
      <td>112-118</td>
    </tr>
    <tr>
      <td>3XL</td>
      <td>54-56</td>
      <td>88-92</td>
      <td>118-122</td>
    </tr>
    <tr>
      <td>4XL</td>
      <td>56-58</td>
      <td>92-96</td>
      <td>122-126</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.modal-sizes__title {
  font-size: var(--fz-h2);
  line-height: var(--fz-h1);
  text-align: left;

  @media (max-width: $tablet) {
    margin-bottom: 1rem;
  }

  @media (max-width: $mobile) {
    text-align: center;
    margin-bottom: .8rem;
  }
}

.modal-sizes__text {
  font-weight: 300;
  font-size: 1.5rem;
  margin-bottom: 3.9rem;

  @media (max-width: $tablet) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: $mobile) {
    text-align: center;
    margin-bottom: 1.2rem;
  }
}

.modal-sizes__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  & th {
    padding: 1.3rem 2rem 1.5rem;
    border-right: .1rem solid #E7E7E7;
    border-top: .1rem solid #E7E7E7;
    border-bottom: .1rem solid #E7E7E7;;
    font-size: 1.4rem;
    font-weight: 700;
    text-align: left;

    &:first-child {
      border-top-left-radius: 2rem;
      border-left: .1rem solid #E7E7E7;
    }

    &:last-child {
      border-top-right-radius: 2rem;
    }

    @media (max-width: $mobile) {
      font-size: 1.2rem;
      padding: 1rem .9rem;
      line-height: 120%;
    }
  }

  & td {
    border-right: .1rem solid #E7E7E7;
    padding: 1.5rem 2rem;
    font-size: 1.4rem;
    font-weight: 700;

    &:first-child {
      border-left: .1rem solid #E7E7E7;
    }

    @media (max-width: $mobile) {
      font-size: 1.2rem;
      padding: .5rem .7rem;
    }
  }

  & tr:last-child td {
    border-bottom: .1rem solid #E7E7E7;;

    &:first-child {
      border-bottom-left-radius: 2rem;
    }

    &:last-child {
      border-bottom-right-radius: 2rem;
    }
  }
}

</style>