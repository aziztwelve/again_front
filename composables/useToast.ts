const toasts = ref<Array<{ id: number; message: string; visible: boolean }>>([]);
let nextId = 0;

export const useToast = () => {
    const show = (message: string, duration = 2500) => {
        const id = nextId++;
        toasts.value.push({ id, message, visible: true });

        setTimeout(() => {
            const toast = toasts.value.find(t => t.id === id);
            if (toast) toast.visible = false;
        }, duration);

        setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== id);
        }, duration + 400);
    };

    return { toasts, show };
};
