var MIME_TYPES = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif',
};

export async function onRequest(context) {
    var key = new URL(context.request.url).searchParams.get('key');
    if (!key) {
        return new Response('Missing key parameter', { status: 400 });
    }

    try {
        var obj = await context.env.DECAL_UPLOADS.get(key);
        if (!obj) {
            return new Response('Not found', { status: 404 });
        }

        var ext = key.split('.').pop().toLowerCase();
        var contentType = MIME_TYPES[ext] || 'application/octet-stream';

        return new Response(obj.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'private, max-age=3600',
            }
        });
    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
}
