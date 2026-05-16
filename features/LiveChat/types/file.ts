// Attachment Model
export interface Attachment {
    id: number
    message_id: number
    type: 'image' | 'file' | 'audio' | 'video'
    url: string
    file_name: string
    file_size?: number
    file_path?: string
    mime_type?: string
    created_at?: string
}

// File для загрузки (до отправки на сервер)
export interface PendingFile {
    id: string                    // временный ID (для UI)
    file: File                    // объект File из input
    preview?: string              // base64 превью для изображений
    type: 'image' | 'audio' | 'file'
    size: number
    name: string
    uploadProgress?: number       // процент загрузки (0-100)
    error?: string               // ошибка загрузки
}

// Допустимые типы файлов
export type AllowedFileType =
    'image/jpeg'
    | 'image/jpg'
    | 'image/png'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/mp4'

export const ALLOWED_FILE_TYPES: AllowedFileType[] = [
    'image/jpeg',
    // 'image/jpg',
    'image/png',
    // 'audio/mpeg',   // mp3
    // 'audio/wav',
    // 'audio/ogg',
    // 'audio/mp4'     // m4a
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_FILES_COUNT = 5

// Утилита для проверки типа файла
export function isAllowedFileType(file: File): boolean {
    return ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)
}

// Утилита для получения типа attachment из MIME
export function getAttachmentTypeFromMime(mimeType: string): 'image' | 'audio' | 'file' {
    if (mimeType.startsWith('image/')) {
        return 'image'
    }
    if (mimeType.startsWith('audio/')) {
        return 'audio'
    }
    return 'file'
}

// Утилита для форматирования размера файла
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Утилита для валидации файла
export interface FileValidationResult {
    valid: boolean
    error?: string
}

export function validateFile(file: File): FileValidationResult {
    // Проверка типа
    if (!isAllowedFileType(file)) {
        return {
            valid: false,
            error: 'Неподдерживаемый формат файла. Разрешены: JPG, PNG, MP3, WAV, OGG, M4A'
        }
    }

    // Проверка размера
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Файл слишком большой. Максимальный размер: ${formatFileSize(MAX_FILE_SIZE)}`
        }
    }

    return {valid: true}
}