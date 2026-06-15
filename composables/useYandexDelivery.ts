import { useCartStore } from '~/stores/cart';

export interface YandexOffer {
  offer_id: string;
  tariff_name?: string;
  price: number;
  delivery_date?: string;
  delivery_interval?: { from: string; to: string };
}

export interface YandexPvzPoint {
  id: string;
  name: string;
  address: { full_address?: string; geo_id?: number } | string;
  position?: { latitude: number; longitude: number };
  schedule?: unknown;
  contact?: { phone?: string };
}

export function useYandexDelivery() {
  const cartStore = useCartStore();

  /**
   * Геокодирование адреса (Яндекс.Карты Геокодер)
   */
  const geocode = async (address: string): Promise<[number, number] | null> => {
    const { data, error } = await useApi('/public/delivery/yandex/geocode', {
      query: { address },
    });

    if (error.value || !data.value?.success) {
      return null;
    }

    return data.value.coordinates;
  };

  /**
   * Определение населённого пункта (geo_id) по адресу/фрагменту.
   * Platform API: location/detect
   */
  const detectLocation = async (location: string): Promise<any | null> => {
    const { data, error } = await useApi('/public/delivery/yandex/location', {
      query: { location },
    });

    if (error.value || !data.value?.success) {
      return null;
    }

    return data.value.location;
  };

  /**
   * Получить items для расчёта из корзины
   */
  const getItemsForCalculate = () => {
    return cartStore.cart.map(item => ({
      size: {
        length: item.length || 20,
        width: item.width || 15,
        height: item.height || 10,
      },
      weight: item.weight || 500,
      quantity: item.quantity || 1,
    }));
  };

  /**
   * Расчёт вариантов доставки (офферов).
   * Platform API: offers/create
   */
  const calculate = async (
    cityName: string,
    address: string,
    _isPickup = false
  ): Promise<YandexOffer[]> => {
    const coords = await geocode(`${cityName}, ${address}`);
    if (!coords) return [];

    const { data, error } = await useApi('/public/delivery/yandex/calculate', {
      method: 'POST',
      body: {
        items: getItemsForCalculate(),
        destination: {
          address: `${cityName}, ${address}`,
          coordinates: coords,
        },
      },
    });

    if (error.value || !data.value?.success) {
      return [];
    }

    return data.value.offers || [];
  };

  /**
   * Получить список ПВЗ.
   * Platform API: pickup-points/list
   */
  const getPvzList = async (geoId?: number): Promise<YandexPvzPoint[]> => {
    const query: Record<string, string> = {};
    if (geoId) query.geo_id = String(geoId);

    const { data, error } = await useApi('/public/delivery/yandex/pvz', { query });

    if (error.value || !data.value?.success) {
      return [];
    }

    return data.value.points || [];
  };

  /**
   * Бронирование выбранного оффера.
   * Platform API: offers/confirm → request_id
   */
  const confirmOffer = async (offerId: string): Promise<string | null> => {
    const { data, error } = await useApi('/public/delivery/yandex/offers/confirm', {
      method: 'POST',
      body: { offer_id: offerId },
    });

    if (error.value || !data.value?.success) {
      return null;
    }

    return data.value.request_id ?? null;
  };

  return {
    geocode,
    detectLocation,
    getItemsForCalculate,
    calculate,
    getPvzList,
    confirmOffer,
  };
}
