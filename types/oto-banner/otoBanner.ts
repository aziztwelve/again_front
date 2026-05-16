export interface OtoBanner {
    id: number
    name: string
    status: 'active' | 'inactive'
    device_type: 'desktop' | 'mobile'
    title: string | null
    subtitle: string | null
    button_enabled: boolean
    button_text: string | null
    input_field_enabled: boolean
    input_field_type: 'email' | 'phone' | 'text'
    input_field_label: string | null
    input_field_placeholder: string | null
    input_field_required: boolean
    display_delay_seconds: number
    privacy_text: string | null
    image: {
        url: string
    } | null
}

export interface OtoBannerSubmitData {
    name?: string
    email?: string
    phone?: string
    message?: string
    input_field_value: string
}

export interface OtoBannerViewData {
    session_id: string
}