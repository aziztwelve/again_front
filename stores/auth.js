import {defineStore, skipHydrate} from 'pinia';
import {ModalsMessage} from "#components";

export const useAuthStore = defineStore('authStore', () => {
    const user = ref({
        email: '',
        id: '',
    });
    const token = useCookie('auth_token');
    const isAuthenticated = ref(false);
    const isCodeActive = ref(false);
    const isChecked = ref(false);
    const modal = useModal();

    const sendCode = async (email) => {
        const {data} = await useApi('/login', {
            params: {
                email: email,
            }
        }, '', 'POST');

        if (data.value.success) {
            isCodeActive.value = true;
            modal.openModal(ModalsMessage, {
                customClass: 'message',
                title: 'Код подтрвеждения',
                text: 'На вашу почту был отправлен код для авторизации на сайте'
            })
        }

        return data;
    }

    const login = async (email, code) => {
        try {
            const {data, error} = await useApi('/check-verification', {
                body: {
                    email: email,
                    verification_code: code
                }
            }, '', 'POST');

            if (!data.value?.user || !data.value?.token) {
                return error.value;
            }

            user.value = data.value.user;
            token.value = data.value.token;
            isAuthenticated.value = true;
            isCodeActive.value = false;


            // if (process.client) {
            //     localStorage.setItem('auth_token', data.value.token)
            // }

            return navigateTo('/profile/settings');
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        user.value = {};
        token.value = null;
        isAuthenticated.value = false;

        // if (process.client) {
        //     localStorage.removeItem('auth_token');
        // }

        // Чистим externalId онлайн-чата, чтобы переписка не «утекла» к следующему
        // пользователю, который залогинится на этом же браузере.
        if (process.client) {
            try { localStorage.removeItem('externalId'); } catch (e) { /* ignore */ }
        }

        return navigateTo('/');
    }

    const checkAuth = async () => {
        if (!token.value) {
            isAuthenticated.value = false;
            isChecked.value = true;
            return;
        }

        try {
            const {data} = await useApi('/client-user');
            if (data.value.success) {
                user.value = data.value.user;
                isAuthenticated.value = true;
            }
        } catch (error) {
            return error;
        } finally {
            isChecked.value = true;
        }
    }

    const updateProfile = (form) => {
        if (!user.value.profile) user.value.profile = {};
        user.value.profile.birthday = getDateFormat().formatDateOutput(form.value.birthday.value);
        user.value.profile.first_name = form.value.first_name.value;
        user.value.profile.last_name = form.value.last_name.value;
        user.value.profile.phone = form.value.phone.value;
        user.value.email = form.value.email.value;
    }

    const updateAddress = (form) => {
        user.value.profile.delivery_country_id = form.value.delivery_country_id.value;
        user.value.profile.delivery_postal_code = form.value.delivery_postal_code.value;
        user.value.profile.delivery_city_id = form.value.delivery_city_id.value;
        user.value.profile.delivery_address = form.value.delivery_address.value;
    }

    return {
        user,
        token: skipHydrate(token),
        isAuthenticated,
        isCodeActive,
        isChecked,
        sendCode,
        login,
        logout,
        checkAuth,
        updateProfile,
        updateAddress,
    }
})