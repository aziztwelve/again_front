// Temporary access for storefront review. Restore to true after all review work.
// See AGENTS.md and lara_admin/docs/deploy-runbook.md.
const DEV_BASIC_AUTH_ENABLED = false;

export default defineEventHandler((event) => {
    const host = getRequestHeader(event, "host") || "";
    const hostname = host.split(":")[0];
    const isDevDomain = hostname === "againdev3.ru";
    if (!isDevDomain || !DEV_BASIC_AUTH_ENABLED) return;

    const auth = getRequestHeader(event, "authorization") || "";

    const okUser = "dev";
    const okPass = "12345678";


    const token = auth.startsWith("Basic ") ? auth.slice(6) : "";
    const decoded = token ? Buffer.from(token, "base64").toString("utf8") : "";
    const [user, pass] = decoded.split(":");

    if (user === okUser && pass === okPass) return;

    setResponseHeader(event, "WWW-Authenticate", 'Basic realm="Dev Area"');
    throw createError({statusCode: 401, statusMessage: "Unauthorized"});
});
