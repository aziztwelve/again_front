/**
 * Nuxt Plugin для Яндекс.Метрики
 * Автоматически загружает счетчик на основе настроек из админки
 */

interface AnalyticsResponse {
    success: boolean
    data: {
        yandex_metrika_enabled: boolean
        yandex_metrika_id: string | null
        yandex_metrika_webvisor?: boolean
        yandex_metrika_clickmap?: boolean
        yandex_metrika_tracklinks?: boolean
        yandex_metrika_accurateTrackBounce?: boolean
    }
}

export default defineNuxtPlugin(async () => {
    // Только на клиентской стороне
    if (process.server) return

    try {
        // Получаем настройки аналитики из API через useApi
        const { data, error } = await useApi<AnalyticsResponse>('/public/settings/analytics')

        if (error.value) {
            console.warn('[Yandex.Metrika] Ошибка получения настроек:', error.value)
            return
        }

        if (!data.value?.success || !data.value?.data) {
            console.warn('[Yandex.Metrika] Настройки не получены')
            return
        }

        const settings = data.value.data

        // Проверяем, включена ли метрика и есть ли ID
        if (!settings.yandex_metrika_enabled || !settings.yandex_metrika_id) {
            console.info('[Yandex.Metrika] Счетчик отключен в настройках')
            return
        }

        const counterId = settings.yandex_metrika_id

        // Подготовка опций
        const options: Record<string, boolean> = {
            clickmap: settings.yandex_metrika_clickmap ?? true,
            trackLinks: settings.yandex_metrika_tracklinks ?? true,
            accurateTrackBounce: settings.yandex_metrika_accurateTrackBounce ?? true,
            webvisor: settings.yandex_metrika_webvisor ?? true,
        }

        // Загрузка скрипта Яндекс.Метрики
        loadYandexMetrika(counterId, options)

        console.info(`[Yandex.Metrika] Счетчик ${counterId} успешно загружен`)
    } catch (error) {
        console.error('[Yandex.Metrika] Ошибка загрузки:', error)
    }
})

/**
 * Загружает скрипт Яндекс.Метрики
 */
function loadYandexMetrika(counterId: string, options: Record<string, boolean>) {
    // Инициализация глобального объекта ym
    (function(m: any, e: Document, t: string, r: string, i: string, k: HTMLScriptElement | null, a: HTMLScriptElement | null) {
        m[i] = m[i] || function() {
            (m[i].a = m[i].a || []).push(arguments)
        }
        m[i].l = Number(new Date())

        // Проверка, не загружен ли уже скрипт
        for (let j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) {
                return
            }
        }

        k = e.createElement(t) as HTMLScriptElement
        a = e.getElementsByTagName(t)[0] as HTMLScriptElement
        k.async = true
        k.src = r
        a.parentNode!.insertBefore(k, a)
    })(
        window,
        document,
        'script',
        'https://mc.yandex.ru/metrika/tag.js',
        'ym',
        null,
        null
    )

    // Инициализация счетчика
    // @ts-ignore
    window.ym(counterId, 'init', options)

    // Добавление noscript для случаев, когда JS отключен
    addNoScriptPixel(counterId)
}

/**
 * Добавляет noscript пиксель для отслеживания без JS
 */
function addNoScriptPixel(counterId: string) {
    const noscript = document.createElement('noscript')
    const div = document.createElement('div')
    const img = document.createElement('img')

    img.src = `https://mc.yandex.ru/watch/${counterId}`
    img.style.position = 'absolute'
    img.style.left = '-9999px'
    img.alt = ''

    div.appendChild(img)
    noscript.appendChild(div)
    document.body.appendChild(noscript)
}