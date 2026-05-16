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