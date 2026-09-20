<template>
  <Breadcrumbs />

  <div class="returns page-padding">
    <div class="container">
      <div class="returns-block__header block__header _left">
        <h1 class="block__header-title fz-h2--mobile">Подбор по впитываемости и по размеру</h1>
      </div>
      <section class="size-section absorption-section">
        <h2 class="size-section__title">Подбор белья по впитываемости</h2>
        <div class="absorption-section__table-wrap">
          <table class="modal-sizes__table absorption-section__table">
            <thead>
            <tr>
              <th>Ваша ситуация</th>
              <th>Сколько капель выбрать</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Естественные выделения, овуляция, пот, вместо ежедневок</td>
              <td>0 капель, естественная влага</td>
            </tr>
            <tr>
              <td>Мажущие выделения, капельное недержание</td>
              <td>1 капля, super light (5 мл, как 1 тампон)</td>
            </tr>
            <tr>
              <td>Первый или последний день месячных, легкое подтекание мочи</td>
              <td>2 капли, light (10 мл, как 2 тампона)</td>
            </tr>
            <tr>
              <td>Скудные дни</td>
              <td>3 капли, normal (15 мл, как 2–3 тампона)</td>
            </tr>
            <tr>
              <td>Умеренные выделения, длительное ношение</td>
              <td>4–6 капель, ultra night или maxi (20–30 мл, как 3–6 тампонов)</td>
            </tr>
            <tr>
              <td>Ночь</td>
              <td>4–6 капель, ultra night или maxi</td>
            </tr>
            <tr>
              <td>Самые обильные дни</td>
              <td>6 капель, maxi (30 мл, как 5–6 тампонов)</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="absorption-section__tips">
          <h3>Несколько советов</h3>
          <p>Интенсивность выделений меняется в течение цикла, поэтому удобнее иметь 2–3 пары с разным количеством капель: полегче для начала и конца месячных, помощнее для обильных дней и ночи.</p>
          <p>Если впереди долгий день, дорога или тренировка, берите бельё на одну ступень впитываемости выше обычного.</p>
          <p>В первый цикл понаблюдайте, как быстро наполняется ластовица. Так вы поймёте свой ритм и будете точно знать, сколько капель нужно в какой день.</p>
        </div>
      </section>
      <section class="size-section">
        <h2 class="size-section__title">Взрослые размеры</h2>
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
      </section>

      <section class="size-section">
        <h2 class="size-section__title">Детские размеры</h2>
        <table class="modal-sizes__table">
          <thead>
          <th>Размер</th>
          <th>Обхват талии</th>
          <th>Обхват бедер</th>
          </thead>
          <tbody>
          <tr>
            <td>2XS</td>
            <td>59-61</td>
            <td>84-86</td>
          </tr>
          <tr>
            <td>XS</td>
            <td>64-66</td>
            <td>98-91</td>
          </tr>
          <tr>
            <td>S</td>
            <td>69-71</td>
            <td>94-96</td>
          </tr>
          <tr>
            <td>M</td>
            <td>74-76</td>
            <td>99-101</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta( {
  title: 'Подбор по впитываемости и по размеру',
} )
</script>

<style scoped lang="scss">
.size-section + .size-section {
  margin-top: 4rem;
}

.size-section__title {
  margin-bottom: 1.6rem;
  font-size: 2rem;
  font-weight: 700;
}

.absorption-section__table-wrap {
  overflow-x: auto;
}

.absorption-section__table {
  min-width: 62rem;

  th,
  td {
    width: 50%;
  }

  td {
    vertical-align: top;
  }
}

.absorption-section__tips {
  margin-top: 3.2rem;
  font-size: 1.6rem;
  line-height: 1.4;

  h3 {
    margin-bottom: 1.6rem;
    font-size: 2rem;
    font-weight: 700;
  }

  p + p {
    margin-top: 1.6rem;
  }

  @media (max-width: $mobile) {
    margin-top: 2.4rem;
    font-size: 1.4rem;
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
