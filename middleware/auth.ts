export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (process.client && !authStore.isChecked) {
        await authStore.checkAuth();
    }

    const isAuthenticated = authStore.isAuthenticated;

    if ( to.path.startsWith('/profile') && !isAuthenticated ) {
        return navigateTo('/login');
    }

    if ( to.path === '/login' && isAuthenticated ) {
        return navigateTo('/profile/settings' );
    }
    //const { isAuthenticated } = storeToRefs( useAuthStore() );
    // const isAuthenticated = computed( () => {
    //     return authStore.isAuthenticated;
    // } );

    // if ( ! isAuthenticated.value ){
    //     abortNavigation();
    //     return navigateTo('/login');
    // }

    // if ( isAuthenticated.value ) {
    //     abortNavigation();
    //     return navigateTo('/profile/settings');
    // }
    //
    // if ( ! isAuthenticated.value ){
    //     abortNavigation();
    //     return navigateTo('/');
    // }

    // if ( process.client && ! isAuthenticated.value ){
    //     return navigateTo('/login');
    // }

    // if ( ! token.value && ! isAuthenticated.value ) {
    //     return navigateTo('/login');
    // }
})