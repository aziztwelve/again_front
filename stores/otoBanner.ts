import { defineStore } from 'pinia'
import type { OtoBanner } from '~/types/oto-banner/otoBanner'

export const useOtoBannerStore = defineStore('otoBanner', () => {
    const banner = ref<OtoBanner | null>(null)
    const isLoading = ref(false)
    const isShown = ref(false) // Показывался ли уже баннер в этой сессии
    const sessionId = ref<string>('')

    /**
     * Получить активный баннер для текущего устройства
     */
    const fetchActiveBanner = async () => {

        console.log({
            'sessionId': sessionId,
            'isShown': isShown.value,
        })

        if (isShown.value) return

        isLoading.value = true

        try {
            const deviceType = getDeviceType()

            const { data, error } = await useApi<{ success: boolean; data: OtoBanner | null }>(
                '/public/oto-banners/active',
                {
                    params: {
                        device_type: deviceType
                    }
                },
                '',
                'GET'
            )

            if (data.value?.success && data.value.data) {
                banner.value = data.value.data
                generateSessionId()
            }
        } catch (error) {
            console.error('Error fetching OTO banner:', error)
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Трекинг просмотра баннера
     */
    const trackView = async () => {
        if (!banner.value || !sessionId.value) return

        try {
            await useApi(
                `/public/oto-banners/${banner.value.id}/view`,
                {
                    body: {
                        session_id: sessionId.value
                    }
                },
                '',
                'POST'
            )
        } catch (error) {
            console.error('Error tracking banner view:', error)
        }
    }

    /**
     * Отправка формы баннера
     */
    const submitBanner = async (formData: {
        name?: string | null
        email?: string | null
        phone?: string | null
        message?: string | null
        input_field_value: string
    }) => {
        if (!banner.value) return { success: false, error: 'Баннер не найден' }

        try {
            const { data, error } = await useApi<{ success: boolean; message: string }>(
                `/public/oto-banners/${banner.value.id}/submit`,
                {
                    body: formData
                },
                '',
                'POST'
            )

            if (data.value?.success) {
                markAsShown()
                return { success: true, data: data.value }
            }

            return { success: false, error: error.value }
        } catch (error) {
            console.error('Error submitting banner:', error)
            return { success: false, error }
        }
    }

    /**
     * Пометить баннер как показанный
     */
    const markAsShown = () => {
        isShown.value = true
        if (process.client) {
            sessionStorage.setItem('oto_banner_shown', 'true')
        }
    }

    /**
     * Проверить, показывался ли уже баннер
     */
    const checkIfShown = () => {
        if (process.client) {
            const shown = sessionStorage.getItem('oto_banner_shown')
            isShown.value = shown === 'true'
        }
    }

    /**
     * Определить тип устройства
     */
    const getDeviceType = (): 'desktop' | 'mobile' => {
        if (!process.client) return 'desktop'
        return window.innerWidth <= 768 ? 'mobile' : 'desktop'
    }

    /**
     * Генерировать уникальный ID сессии
     */
    const generateSessionId = () => {
        if (process.client) {
            let sid = sessionStorage.getItem('oto_session_id')
            if (!sid) {
                sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                sessionStorage.setItem('oto_session_id', sid)
            }
            sessionId.value = sid
        }
    }

    /**
     * Сбросить состояние (для тестирования)
     */
    const reset = () => {
        banner.value = null
        isShown.value = false
        if (process.client) {
            sessionStorage.removeItem('oto_banner_shown')
            sessionStorage.removeItem('oto_session_id')
        }
    }

    return {
        banner,
        isLoading,
        isShown,
        sessionId,
        fetchActiveBanner,
        trackView,
        submitBanner,
        markAsShown,
        checkIfShown,
        reset,
    }
})