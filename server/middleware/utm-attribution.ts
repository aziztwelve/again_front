/**
 * Прямая длинная UTM-ссылка содержит ?utm_link={slug}. Переводим её на
 * Laravel-трекер до SSR страницы: он запишет визит, поставит HttpOnly-cookie
 * utm_link_id и вернёт пользователя на канонический URL с UTM-параметрами.
 */
export default defineEventHandler((event) => {
    if (!['GET', 'HEAD'].includes(event.method)) return

    const slug = getRequestURL(event).searchParams.get('utm_link')
    if (!slug || !/^[a-z0-9]{8}$/.test(slug)) return

    return sendRedirect(event, `/api/public/utm/track/${encodeURIComponent(slug)}`, 302)
})
