import {ModalsBirthdayReminder} from "#components";

export const useBirthdayReminder = () => {
    const modal = useModal();
    const authStore = useAuthStore();
    const route = useRoute();

    const isProfilePath = (path: string) => path.startsWith('/profile');

    const showIfNeeded = () => {
        const {user} = authStore;
        if (!user?.id) return;
        if (user.profile?.birthday) return;
        setTimeout(() => {
            modal.openModal(ModalsBirthdayReminder, {
                customClass: 'message',
                title: 'Заполни дату рождения',
                text: 'Заполни дату рождения, чтобы получить ПОДАРОК от AGAIN'
            });
        }, 3000);
    };

    const trigger = () => {
        if (!process.client) return;
        if (!isProfilePath(route.path)) return;
        if (authStore.isChecked) {
            showIfNeeded();
        } else {
            const stop = watch(() => authStore.isChecked, (isChecked) => {
                if (isChecked) {
                    showIfNeeded();
                    stop();
                }
            });
        }
    };

    // Первый рендер: если страница уже /profile/*
    onMounted(trigger);

    // Каждый «вход» в раздел профиля: переход с не-профильного пути в профильный
    watch(() => route.path, (to, from) => {
        if (process.client && isProfilePath(to) && (!from || !isProfilePath(from))) {
            trigger();
        }
    });
};
