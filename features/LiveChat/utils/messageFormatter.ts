/**
 * Форматирует время сообщения
 * @param date - ISO8601 дата
 * @param format - 'time' (HH:MM) или 'datetime' (HH:MM, DD MMM)
 */
export function formatMessageTime(
    date: string,
    format: 'time' | 'datetime' = 'time'
): string {
    try {
        const messageDate = new Date(date)
        const now = new Date()

        const isToday =
            messageDate.toDateString() === now.toDateString()
        const isYesterday =
            messageDate.toDateString() ===
            new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()

        if (format === 'time') {
            return messageDate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            })
        }

        if (isToday) {
            return messageDate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            })
        }

        if (isYesterday) {
            return 'Вчера ' +
                messageDate.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                })
        }

        return messageDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return ''
    }
}

/**
 * Получает сокращённый размер файла
 * @param bytes - размер в байтах
 */
export function formatFileSize(bytes?: number): string {
    if (!bytes) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Генерирует цвет аватара по имени
 * @param name - имя
 */
export function getAvatarColor(name: string): string {
    const colors = [
        'bg-red-500',
        'bg-pink-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
}

/**
 * Получает инициалы из имени
 * @param fullName - полное имя
 */
export function getInitials(fullName: string): string {
    return fullName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join('')
}

/**
 * Проверяет, было ли сообщение отправлено сегодня
 * @param date - ISO8601 дата
 */
export function isToday(date: string): boolean {
    const messageDate = new Date(date)
    const now = new Date()

    return messageDate.toDateString() === now.toDateString()
}

/**
 * Группирует сообщения по датам
 * @param messages - массив сообщений
 */
export function groupMessagesByDate(
    messages: Array<{ created_at: string; [key: string]: any }>
): Map<string, Array<{ created_at: string; [key: string]: any }>> {
    const grouped = new Map()

    messages.forEach((message) => {
        const date = new Date(message.created_at).toDateString()
        if (!grouped.has(date)) {
            grouped.set(date, [])
        }
        grouped.get(date)?.push(message)
    })

    return grouped
}