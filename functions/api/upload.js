export async function onRequest(context) {
    const body = await context.request.formData();
    const file = body.get('image');

    if (!file) {
        return new Response(JSON.stringify({ error: 'No image file provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Only PNG, JPEG, or WebP allowed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (file.size > 10 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const ext = file.name.split('.').pop();
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await context.env.DECAL_UPLOADS.put(key, await file.arrayBuffer());

    return new Response(JSON.stringify({ imageId: key }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
