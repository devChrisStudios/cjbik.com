function getCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Allow login page and login POST without auth
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
        return await context.next();
    }

    // All other /admin/* paths require valid session
    const session = getCookie(request, 'admin_sesh');
    if (!session || !env.ADMIN_SECRET || session !== env.ADMIN_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    return await context.next();
}
