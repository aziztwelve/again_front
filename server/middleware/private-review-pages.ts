export default defineEventHandler((event) => {
    const path = getRequestURL(event).pathname;

    if (path !== '/' && !path.startsWith('/catalog/')) {
        return;
    }

    setResponseHeader(event, 'Cache-Control', 'private, no-store');
    setResponseHeader(event, 'Vary', 'Authorization, Cookie');
});
