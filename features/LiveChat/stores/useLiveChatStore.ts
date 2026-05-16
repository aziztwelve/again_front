import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message, PendingFile } from '~/features/LiveChat/types'
import {
    useGetOrCreateConversation,
    useSendMessage,
    useMarkConversationAsRead,
} from '~/features/LiveChat/composables/useChatApi'

export const useLiveChatStore = defineStore('liveChat', () => {
    // State
    const isOpen = ref<boolean>(false)
    const isAnimating = ref<boolean>(false)
    const isLoading = ref<boolean>(false)

    const hasUnreadMessages = ref<boolean>(false)
    const unreadCount = ref<number>(0)

    const conversation = ref<Conversation | null>(null)

    const inputMessage = ref<string>('')
    const isSending = ref<boolean>(false)
    const inputError = ref<string | null>(null)

    const clientId = ref<number | null>(null)
    const externalId = ref<string | null>(null)

    // Getters
    const messages = computed(() => conversation.value?.messages || [])

    // Actions: UI
    const openChat = () => {
        isAnimating.value = true
        isOpen.value = true
        setTimeout(() => {
            isAnimating.value = false
        }, 300)
    }

    const closeChat = () => {
        isAnimating.value = true
        setTimeout(() => {
            isOpen.value = false
            isAnimating.value = false
        }, 200)
    }

    const toggleChat = () => {
        if (isOpen.value) {
            closeChat()
        } else {
            openChat()
        }
    }

    // Actions: Data
    const setConversation = (data: Conversation) => {
        conversation.value = data
    }

    const addMessage = (message: Message) => {
        if (conversation.value) {
            conversation.value.messages.push(message)
        }
    }

    // Actions: Input
    const setInputMessage = (message: string) => {
        inputMessage.value = message
    }

    const clearInputMessage = () => {
        inputMessage.value = ''
    }

    const setInputError = (error: string | null) => {
        inputError.value = error
    }

    // Actions: Loading
    const setSending = (sending: boolean) => {
        isSending.value = sending
    }

    const setLoading = (loading: boolean) => {
        isLoading.value = loading
    }

    // Actions: Client
    const setClientInfo = (id: number | null, exId: string | null) => {
        clientId.value = id
        externalId.value = exId
    }

    const setUnreadCountFronLS = () => {
        const stored = localStorage.getItem('chat_unread_count')
        if (stored) {
            if (parseInt(stored) > 0) {
                hasUnreadMessages.value = true
                unreadCount.value = parseInt(stored)
            }
        }
    }

    // Actions: API Calls
    /**
     * Загрузить или создать conversation
     */
    const fetchOrCreateConversation = async () => {
        try {
            setLoading(true)
            setInputError(null)

            const { data, error } = await useGetOrCreateConversation(
                externalId.value!,
                clientId.value,
                'web_chat'
            )

            if (error.value) {
                throw new Error(error.value.message || 'Ошибка загрузки диалога')
            }

            if (data.value) {
                setConversation(data.value.data)
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Ошибка загрузки диалога'
            setInputError(errorMessage)
            console.error('fetchOrCreateConversation error:', err)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Отправить сообщение
     * ← ОБНОВИЛИ: Добавили поддержку файлов
     */
    const sendMessage = async (content: string, files: PendingFile[] = []) => {
        // Валидация: должен быть текст или файлы
        if (!content.trim() && files.length === 0) {
            return
        }

        if (!conversation.value) {
            return
        }

        try {
            setSending(true)
            setInputError(null)

            // Оптимистичное обновление
            const tempMessage: Message = {
                id: Date.now().toString(),
                conversation_id: conversation.value.id,
                content: content || '📎 Файлы', // Если нет текста, показываем иконку
                direction: 'incoming',
                status: 'sending',
                created_at: new Date().toISOString(),
                attachments: [], // Временно пустой массив, после загрузки придут реальные
            }

            addMessage(tempMessage)
            clearInputMessage()

            // Отправляем на сервер (с файлами)
            const { data, error } = await useSendMessage(
                conversation.value.id,
                content || 'Файлы',
                files
            )

            if (error.value) {
                throw new Error(error.value.message || 'Ошибка отправки сообщения')
            }

            if (data.value?.data && conversation.value) {
                // Заменяем временное сообщение на реальное (с attachments)
                const index = conversation.value.messages.findIndex(
                    (m) => m.id === tempMessage.id
                )
                if (index !== -1) {
                    conversation.value.messages[index] = data.value.data
                }
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Ошибка отправки сообщения'
            setInputError(errorMessage)
            console.error('sendMessage error:', err)

            // Помечаем временное сообщение как failed
            if (conversation.value) {
                const tempMsg = conversation.value.messages.find(
                    (m) => m.status === 'sending'
                )
                if (tempMsg) {
                    tempMsg.status = 'failed'
                }
            }
        } finally {
            setSending(false)
        }
    }

    /**
     * Отметить диалог как прочитанный
     */
    const markAsRead = async () => {
        if (!conversation.value) {
            return
        }

        try {
            const { error } = await useMarkConversationAsRead(
                conversation.value.id
            )

            if (error.value) {
                console.error('Error marking as read:', error.value)
                return
            }
        } catch (err) {
            console.error('markAsRead error:', err)
        }
    }

    const incrementUnreadCount = () => {
        unreadCount.value++
        hasUnreadMessages.value = unreadCount.value > 0
        localStorage.setItem('chat_unread_count', String(unreadCount.value))
    }

    const decrementUnreadCount = () => {
        if (unreadCount.value > 0) {
            unreadCount.value--
        }
        hasUnreadMessages.value = unreadCount.value > 0
        localStorage.setItem('chat_unread_count', String(unreadCount.value))
    }

    const resetUnreadCount = () => {
        unreadCount.value = 0
        hasUnreadMessages.value = false
        localStorage.setItem('chat_unread_count', '0')
    }

    return {
        // State
        isOpen,
        isAnimating,
        isLoading,
        conversation,
        inputMessage,
        isSending,
        inputError,
        clientId,
        externalId,

        unreadCount,
        hasUnreadMessages,

        // Getters
        messages,

        // Actions: UI
        openChat,
        closeChat,
        toggleChat,
        resetUnreadCount,
        incrementUnreadCount,
        decrementUnreadCount,
        setUnreadCountFronLS,

        // Actions: Data
        setConversation,
        addMessage,

        // Actions: Input
        setInputMessage,
        clearInputMessage,
        setInputError,

        // Actions: Loading
        setSending,
        setLoading,

        // Actions: Client
        setClientInfo,

        // Actions: API
        fetchOrCreateConversation,
        sendMessage,
        markAsRead,
    }
})