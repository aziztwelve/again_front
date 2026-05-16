import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
    if (process.server) return

    window.Pusher = Pusher

    const REVERB_KEY = useRuntimeConfig().public.REVERB_KEY || ''
    const REVERB_HOST = useRuntimeConfig().public.REVERB_HOST || window.location.hostname
    const REVERB_PORT = Number(useRuntimeConfig().public.REVERB_PORT || 443)
    const REVERB_SCHEME = useRuntimeConfig().public.REVERB_SCHEME || 'wss'
    const API_BASE = (useRuntimeConfig().public.API_BASE_URL || '').replace(/\/$/, '')

    const authEndpoint = API_BASE ? `${API_BASE}/broadcasting/auth` : '/broadcasting/auth'

    const authStore = useAuthStore()
    const access_token = authStore.token

    const enabledTransports = ['ws', 'wss']
    const forceTLS = REVERB_SCHEME === 'wss'

    const echoInstance = new Echo({
        broadcaster: 'reverb',
        key: REVERB_KEY,
        wsHost: REVERB_HOST,
        wsPort: REVERB_PORT,
        wssPort: REVERB_PORT,
        forceTLS: forceTLS,
        encrypted: forceTLS,
        enabledTransports: enabledTransports,
        disableStats: true,
        authEndpoint: authEndpoint,
        auth: {
            headers: access_token ? {
                'Authorization': `Bearer ${access_token}`,
            } : {},
        },
    })
    window.Echo = echoInstance
    console.log('Echo instance created:', echoInstance)

    return {
        provide: {
            echo: echoInstance,
        },
    }
})