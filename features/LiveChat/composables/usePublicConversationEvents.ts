import {useLiveChatStore} from "~/features/LiveChat/stores/useLiveChatStore";

/**
 * Composable для подписки на события conversation для публичного клиента
 * Использует conversation_id вместо external_id
 */
export function usePublicConversationEvents(conversationId: number | null) {
    const {$echo} = useNuxtApp()
    const store = useLiveChatStore()

    const countNewEvents = ref(0)

    if (!conversationId || !$echo) return

    /**
     * Слушаем новые сообщения от оператора
     */
    const subscribeToEvents = () => {
        try {
            // Подписываемся на канал по conversation_id
            $echo.channel(`public.conversation.${conversationId}`)
                .listen('.MessageCreated', (event: any) => {
                    console.log('New message event received:', event)

                    // Если сообщение входящее (от оператора) - добавляем в store
                    if (event.direction === 'outgoing') {
                        const newMessage = {
                            id: event.id,
                            conversation_id: event.conversation_id,
                            content: event.content,
                            direction: event.direction,
                            status: event.status,
                            created_at: event.created_at,
                            attachments: event.attachments || [],
                        }

                        store.incrementUnreadCount()
                        store.addMessage(newMessage)
                    }
                })

            console.log($echo.channel(`public.conversation.${conversationId}`))
        } catch (error) {
            console.error('Error subscribing to conversation events:', error)
        }
    }

    /**
     * Отписываемся от канала
     */
    const unsubscribeFromEvents = () => {
        try {
            $echo.leaveChannel(`public.conversation.${conversationId}`)
            console.log(`Unsubscribed from public.conversation.${conversationId}`)
        } catch (error) {
            console.error('Error unsubscribing from conversation events:', error)
        }
    }

    return {
        subscribeToEvents,
        unsubscribeFromEvents,
    }
}