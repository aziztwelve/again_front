export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore();

    if ( process.client ) {
        await authStore.checkAuth();
    }

    return {
        provide: {
            auth: authStore,
        },
    }
})
