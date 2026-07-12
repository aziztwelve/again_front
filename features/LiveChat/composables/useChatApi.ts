import type {Conversation, Message, PendingFile} from '~/features/LiveChat/types'
import useApi from '~/composables/useApi'

export async function useGetOrCreateConversation(
    externalId: string | number,
    clientId?: number | null,
    source: 'web_chat' | 'telegram' | 'vk' | 'whatsapp' = 'web_chat'
) {
    const params = new URLSearchParams()

    if (clientId) {
        params.append('client_id', String(clientId))
    }

    params.append('source', source)
    params.append('external_id', String(externalId))

    const queryString = params.toString()
    const url = `/public/conversations/client${queryString ? '?' + queryString : ''}`

    return useApi<{
        data: Conversation,
        error: Error
    }>(url, {
        method: 'GET',
    })
}

// ← ОБНОВИЛИ: Добавили поддержку файлов
export async function useSendMessage(
    conversationId: number | string,
    content: string,
    files?: PendingFile[]
) {
    const url = `/public/conversations/${conversationId}/reply`

    // Если есть файлы - используем FormData
    if (files && files.length > 0) {
        const formData = new FormData()

        // Добавляем текст сообщения
        formData.append('content', content)

        // Добавляем файлы
        files.forEach((pendingFile, index) => {
            formData.append(`attachments[${index}]`, pendingFile.file)
        })

        return useApi<{
            data: Message,
        }>(url, {
            method: 'POST',
            body: formData,
            // НЕ указываем Content-Type - браузер сам установит с boundary
        })
    }

    // Если нет файлов - отправляем JSON как раньше
    return useApi<{
        data: Message,
    }>(url, {
        method: 'POST',
        body: JSON.stringify({
            content: content,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function useMarkConversationAsRead(
    conversationId: number | string
) {
    const url = `/public/conversations/${conversationId}/read`

    return useApi<{ success: boolean }>(url, {
        method: 'POST',
    })
}

export interface MessengerLinks {
    token: string
    links: {
        telegram?: string
        max?: string
        vk?: string
    }
}

/**
 * Получить deeplink-ссылки мессенджеров с токеном привязки переписки к
 * клиенту/заказу. См. docs/tasks/messenger-deeplink-binding.md
 *
 * Использует $fetch (вызывается на клиенте в onMounted), передаёт external_id
 * веб-чата и, опционально, view_token заказа.
 */
export async function useGetMessengerLinks(
    externalId: string | number,
    orderToken?: string | null
): Promise<MessengerLinks> {
    const DEV_URI = useRuntimeConfig().public.DEV_URI
    const authStore = useAuthStore()

    const params = new URLSearchParams()
    if (externalId) params.append('external_id', String(externalId))
    if (orderToken) params.append('order_token', orderToken)

    const headers: Record<string, string> = {}
    if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
    }

    const queryString = params.toString()
    const url = `${DEV_URI}/public/chat/messenger-links${queryString ? '?' + queryString : ''}`

    return $fetch<MessengerLinks>(url, {
        method: 'GET',
        headers,
        credentials: 'include',
    })
}