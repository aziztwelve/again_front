// Константы для Live Chat виджета
export const CHAT_CONSTANTS = {
    // Размеры
    WIDGET_WIDTH: '384px', // w-96
    WIDGET_HEIGHT: '600px',
    COLLAPSED_SIZE: '60px',
    HEADER_HEIGHT: '56px',
    INPUT_HEIGHT: '80px',

    // Анимации (в миллисекундах)
    ANIMATION_OPEN_DURATION: 300,
    ANIMATION_CLOSE_DURATION: 200,
    ANIMATION_MESSAGE_DURATION: 200,

    // Цвета (для красной темы)
    PRIMARY_COLOR: 'red-500',
    SECONDARY_COLOR: 'gray-100',
    DARK_SECONDARY: 'gray-700',
    TEXT_PRIMARY: 'gray-900',
    TEXT_DARK: 'gray-100',
}

// Соцсети - ссылки и иконки
export const SOCIAL_SOURCES = [
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'MessageCircle', // или используй lucide-react WhatsApp иконку
        url: 'https://wa.me/YOUR_PHONE_NUMBER', // placeholder
        color: 'green-500',
    },
    {
        id: 'vk',
        name: 'VK',
        icon: 'Share2',
        url: 'https://vk.com/YOUR_PAGE', // placeholder
        color: 'blue-600',
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: 'Send',
        url: 'https://t.me/YOUR_CHANNEL', // placeholder
        color: 'blue-400',
    },
]

// Статусы сообщений с иконками
export const MESSAGE_STATUS_ICONS = {
    sending: 'Clock',
    sent: 'Check',
    delivered: 'CheckCheck',
    read: 'Eye',
    failed: 'AlertCircle',
}

export const MESSAGE_STATUS_COLORS = {
    sending: 'opacity-70',
    sent: 'opacity-70',
    delivered: 'opacity-70',
    read: 'opacity-70',
    failed: 'text-red-500',
}