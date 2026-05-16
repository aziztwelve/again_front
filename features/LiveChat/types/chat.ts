// Message Model
import type {Attachment} from './file'

export interface Message {
    // Идентификаторы
    id: string | number
    conversation_id: number

    // Содержание
    content: string
    direction: 'incoming' | 'outgoing'
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

    content_type?: 'text' | 'image' | 'file' | 'audio' | 'video'  // ← добавили

    // Временные метки
    created_at: string // ISO8601
    updated_at?: string

    // Отправитель/получатель
    sender_id?: number
    reader_id?: number

    // Прикрепления
    attachments: Attachment[]
}

// User Model
export interface User {
    id: number
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'manager' | 'support'
    is_online: boolean
    last_seen_at?: string
}

// Client Profile
export interface ClientProfile {
    id: number
    client_id: number
    fullName: string
    phone: string
    image: string | null
    address: string | null
    bio?: string
    avatar_url?: string
}

// Client Model
export interface Client {
    id: number
    name: string
    email?: string
    phone?: string
    external_id: string
    source: 'vk' | 'telegram' | 'whatsapp' | 'web_chat'
    created_at: string
    updated_at: string

    // Relations
    profile?: ClientProfile
    conversations?: Conversation[]
}

// Conversation Model
export interface Conversation {
    // Основное
    id: number
    client_id: number
    source: 'vk' | 'telegram' | 'whatsapp' | 'web_chat'

    // Статус
    status: 'active' | 'archived' | 'closed'
    unread_count: number

    // Назначение
    assigned_to?: number | null

    // Временные метки
    last_message_at: string | null
    created_at: string
    updated_at: string

    // Relations
    client: Client
    messages: Message[]
    assigned_user?: User
}

// WebSocket Events
export interface MessageCreatedEvent {
    message: Message
    conversation_id: number
}

export interface MessageStatusUpdatedEvent {
    message_id: string | number
    status: Message['status']
}

// UI State types
export type ChatSource = 'vk' | 'telegram' | 'whatsapp' | 'web_chat'

export interface SourceLink {
    source: ChatSource
    url: string
    label: string
}