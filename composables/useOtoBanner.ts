export const useOtoBanner = () => {
    const otoBannerStore = useOtoBannerStore()
    const modal = useModal()

    /**
     * Инициализировать OTO баннер
     */
    const initOtoBanner = async () => {
        if (!process.client) return

        // Проверяем, показывался ли уже баннер
        otoBannerStore.checkIfShown()

        if (otoBannerStore.isShown) {
            return
        }

        // Загружаем активный баннер
        await otoBannerStore.fetchActiveBanner()

        // Если баннер есть, показываем через заданное время
        if (otoBannerStore.banner) {
            const delay = otoBannerStore.banner.display_delay_seconds * 1000

            setTimeout(() => {
                showOtoBanner()
            }, delay)
        }
    }

    /**
     * Показать OTO баннер
     */
    const showOtoBanner = () => {
        const {ModalsOtoBanner} = useModals()


        modal.openModal(ModalsOtoBanner, {
            banner: otoBannerStore.banner,
            customClass: 'oto',
        })

        // Трекаем просмотр
        otoBannerStore.trackView()
    }

    /**
     * Отправить форму OTO баннера
     */
    const submitOtoBanner = async (formData: {
        name?: string | null
        email?: string | null
        phone?: string | null
        message?: string | null
        input_field_value: string
    }) => {
        const result = await otoBannerStore.submitBanner(formData)

        if (result.success) {
            // Закрываем OTO модалку
            modal.closeModal()

            // Достаём статус промо из ответа бэка
            const promoStatus = result.data?.data?.meta?.promo?.status

            // Показываем Success модалку
            const { ModalsSuccess } = useModals()

            setTimeout(() => {
                // Если промо уже выдавали — показываем другой текст
                if (promoStatus === 'already_issued') {
                    modal.openModal(ModalsSuccess, {
                        title: 'Скидка уже доступна',
                        text: 'Вы уже получали этот промокод. Посмотрите в личном кабинете: Профиль → Скидки и бонусы.'
                    })
                    return
                }

                // Обычный сценарий (впервые отправили)
                modal.openModal(ModalsSuccess, {
                    title: 'Спасибо!',
                    text: 'Ваша заявка успешно отправлена'
                })
            }, 1000)
        }

        return result
    }


    return {
        initOtoBanner,
        showOtoBanner,
        submitOtoBanner,
    }
}

/**
 * Helper для динамического импорта модалок
 */
const useModals = () => {
    return {
        ModalsOtoBanner: defineAsyncComponent(() => import('~/components/Modals/OtoBanner/ModalsOtoBanner.vue')),
        ModalsSuccess: defineAsyncComponent(() => import('~/components/Modals/Success.vue'))
    }
}
