export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (process.client && !authStore.isChecked) {
        await authStore.checkAuth();
    }

    const isAuthenticated = authStore.isAuthenticated;
    if ( isAuthenticated ){
        return navigateTo('/profile/settings' );
    }
})