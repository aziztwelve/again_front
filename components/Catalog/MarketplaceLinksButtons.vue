<template>
  <div v-if="hasLinks" class="marketplace-buttons">
    <a
        v-if="links.wb"
        :href="links.wb"
        target="_blank"
        rel="noopener noreferrer"
        class="marketplace-btn wb-btn"
    >

      Заказать на WB
    </a>
    <a
        v-if="links.ozon"
        :href="links.ozon"
        target="_blank"
        rel="noopener noreferrer"
        class="marketplace-btn ozon-btn"
    >

      Заказать на Ozon
    </a>
    <a
        v-if="links.zy"
        :href="links.zy"
        target="_blank"
        rel="noopener noreferrer"
        class="marketplace-btn zy-btn"
    >
      Заказать в Золотом Яблоке
    </a>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

interface MarketplaceLinks {
  wb?: string | null
  ozon?: string | null
  zy?: string | null
}

interface Props {
  marketplaceLinks?: MarketplaceLinks | string | null
}

const props = withDefaults(defineProps<Props>(), {
  marketplaceLinks: null
})

const links = computed<MarketplaceLinks>(() => {
  if (!props.marketplaceLinks) {
    return {wb: null, ozon: null, zy: null}
  }

  // Если это строка (JSON), распарси её
  if (typeof props.marketplaceLinks === 'string') {
    try {
      return JSON.parse(props.marketplaceLinks)
    } catch {
      return {wb: null, ozon: null, zy: null}
    }
  }

  // Если это уже объект, верни как есть
  return props.marketplaceLinks
})

const hasLinks = computed(() => {
  return !!(links.value.wb || links.value.ozon || links.value.zy)
})
</script>

<style scoped>
.marketplace-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin-top: auto;
}

.marketplace-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1.4rem 1.2rem;
  border-radius: 5.3rem;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.marketplace-btn:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.marketplace-btn:active {
  transform: translateY(0);
}

/* WB - Wildberries (Фиолетовый) */
.wb-btn {
  background: linear-gradient(135deg, #983DF4 0%, #7B2FD4 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.wb-btn:hover {
  background: linear-gradient(135deg, #7B2FD4 0%, #6B25B0 100%);
  box-shadow: 0 8px 24px rgba(152, 61, 244, 0.35);
}

.wb-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

/* OZON - Синий */
.ozon-btn {
  background: linear-gradient(135deg, #005BFF 0%, #0047CC 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 700;
}

.ozon-btn:hover {
  background: linear-gradient(135deg, #0047CC 0%, #003BA3 100%);
  box-shadow: 0 8px 24px rgba(0, 91, 255, 0.35);
}

.ozon-icon {
  width: 20px;
  height: 20px;
}

/* Золотое яблоко - Жёлтый/Лайм */
.zy-btn {
  background: linear-gradient(135deg, #E3FE52 0%, #D4ED3A 100%);
  color: #1a1a1a;
  font-weight: 700;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(227, 254, 82, 0.25);
}

.zy-btn:hover {
  background: linear-gradient(135deg, #D4ED3A 0%, #C5DE22 100%);
  color: #000;
  box-shadow: 0 8px 24px rgba(227, 254, 82, 0.4);
}

.zy-icon {
  width: 20px;
  height: 20px;
  color: #1a1a1a;
}

/* Адаптив для планшетов */
@media (max-width: 768px) {
  .marketplace-buttons {
    gap: 8px;
  }

  .marketplace-btn {
    padding: 1.2rem 1rem;
    font-size: 13px;
  }

  .wb-icon,
  .ozon-icon,
  .zy-icon {
    width: 18px;
    height: 18px;
  }
}

/* Адаптив для мобильных */
@media (max-width: 640px) {
  .marketplace-buttons {
    gap: 8px;
  }

  .marketplace-btn {
    padding: 1rem 0.8rem;
    font-size: 12px;
    border-radius: 4.5rem;
    gap: 6px;
  }

  .wb-icon,
  .ozon-icon,
  .zy-icon {
    width: 16px;
    height: 16px;
  }

  .marketplace-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  }
}

/* Для совсем маленьких экранов */
@media (max-width: 380px) {
  .marketplace-btn {
    padding: 0.8rem 0.6rem;
    font-size: 11px;
    gap: 4px;
  }

  .wb-icon,
  .ozon-icon,
  .zy-icon {
    width: 14px;
    height: 14px;
  }
}

/* Для тёмной темы (опционально) */
@media (prefers-color-scheme: dark) {
  .zy-btn {
    box-shadow: 0 2px 8px rgba(227, 254, 82, 0.15);
  }

  .zy-btn:hover {
    box-shadow: 0 8px 24px rgba(227, 254, 82, 0.25);
  }
}
</style>