function getCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function renderLogin(error) {
    return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Admin — BIKFAM</title>' +
    '<style>' +
    'body{margin:0;background:#0a0a0a;color:#eee;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}' +
    '.box{background:#151515;padding:2.5rem;border-radius:8px;width:100%;max-width:360px;box-sizing:border-box}' +
    'h1{font-size:1.75rem;text-align:center;margin:0 0 1.5rem}' +
    '.red{color:#d90429}' +
    'input{width:100%;padding:0.75rem;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#eee;font-size:1rem;box-sizing:border-box;outline:none}' +
    'input:focus{border-color:#d90429}' +
    'button{width:100%;padding:0.75rem;background:#d90429;color:#fff;border:none;border-radius:4px;font-size:1rem;cursor:pointer;margin-top:1rem}' +
    'button:hover{background:#b00322}' +
    '.error{color:#ff4444;text-align:center;margin-bottom:1rem;font-size:0.875rem}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="box">' +
    '<h1><span class="red">BIK</span>FAM Admin</h1>' +
    (error ? '<div class="error">' + error + '</div>' : '') +
    '<form method="POST" action="/admin">' +
    '<input type="password" name="password" placeholder="Admin password" required autofocus>' +
    '<button type="submit">Sign In</button>' +
    '</form>' +
    '</div>' +
    '</body>' +
    '</html>';
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderDashboard(orders) {
    var rows = orders.map(function(order) {
        var itemsHtml = (order.items || []).map(function(item) {
            var imgLink = '';
            if (item.imageId) {
                imgLink = ' — <a href="/admin/image?key=' + encodeURIComponent(item.imageId) + '" target="_blank" style="color:#d90429">View Decal</a>';
            }
            return '<div style="padding:2px 0">' + escapeHtml(item.name) + ' × ' + (item.quantity || 1) + imgLink + '</div>';
        }).join('');

        var date = order.createdAt ? new Date(order.createdAt).toLocaleString() : '—';
        var name = escapeHtml(order.customerName || '—');
        var email = escapeHtml(order.customerEmail || '—');
        var total = order.amountTotal ? '$' + (order.amountTotal / 100).toFixed(2) : '—';

        return '<tr>' +
            '<td>' + date + '</td>' +
            '<td>' + name + '<br><span style="color:#888;font-size:0.8em">' + email + '</span></td>' +
            '<td>' + itemsHtml + '</td>' +
            '<td>' + total + '</td>' +
            '</tr>';
    }).join('') || '<tr><td colspan="4" style="text-align:center;color:#888;padding:2rem">No orders yet</td></tr>';

    return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Admin Dashboard — BIKFAM</title>' +
    '<style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;background:#0a0a0a;color:#eee;font-family:system-ui,sans-serif}' +
    '.header{background:#151515;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #222}' +
    '.header h1{margin:0;font-size:1.25rem}' +
    '.header .red{color:#d90429}' +
    '.header a{color:#888;text-decoration:none;font-size:0.875rem}' +
    '.header a:hover{color:#d90429}' +
    '.content{padding:2rem}' +
    'table{width:100%;border-collapse:collapse}' +
    'th{text-align:left;padding:0.75rem 0.5rem;border-bottom:1px solid #333;color:#888;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em}' +
    'td{padding:1rem 0.5rem;border-bottom:1px solid #1e1e1e;vertical-align:top}' +
    'tr:hover td{background:#111}' +
    '.empty{text-align:center;padding:4rem 2rem}' +
    '.empty-icon{font-size:3rem;margin-bottom:1rem}' +
    '.empty p{color:#888}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<h1><span class="red">BIK</span>FAM Admin</h1>' +
    '<a href="/admin/logout">Sign Out</a>' +
    '</div>' +
    '<div class="content">' +
    (orders.length === 0 ?
        '<div class="empty"><div class="empty-icon">📦</div><p>No orders yet</p></div>' :
        '<table><thead><tr><th>Date</th><th>Customer</th><th>Items</th><th>Total</th></tr></thead><tbody>' + rows + '</tbody></table>') +
    '</div>' +
    '</body>' +
    '</html>';
}

export async function onRequest(context) {
    const { request, env } = context;

    // Handle logout
    if (request.method === 'GET' && new URL(request.url).pathname === '/admin/logout') {
        return new Response('', {
            status: 302,
            headers: {
                'Location': '/admin',
                'Set-Cookie': 'admin_sesh=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
            }
        });
    }

    // Handle login POST
    if (request.method === 'POST') {
        var formData = await request.formData();
        var password = formData.get('password');

        if (password && env.ADMIN_SECRET && password === env.ADMIN_SECRET) {
            return new Response('', {
                status: 302,
                headers: {
                    'Location': '/admin',
                    'Set-Cookie': 'admin_sesh=' + env.ADMIN_SECRET + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400'
                }
            });
        }

        return new Response(renderLogin('Invalid password'), {
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // GET - check if already authenticated
    var session = getCookie(request, 'admin_sesh');
    if (session && env.ADMIN_SECRET && session === env.ADMIN_SECRET) {
        // Fetch orders from R2
        var orders = [];
        try {
            var list = await env.DECAL_UPLOADS.list({ prefix: 'orders/' });
            for (var i = 0; i < list.objects.length; i++) {
                var obj = list.objects[i];
                var data = await env.DECAL_UPLOADS.get(obj.key);
                if (data) {
                    var text = await data.text();
                    var order = JSON.parse(text);
                    orders.push(order);
                }
            }
            orders.sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } catch (e) {
            // R2 not available or no orders
        }

        return new Response(renderDashboard(orders), {
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // Not authenticated - show login
    return new Response(renderLogin(null), {
        headers: { 'Content-Type': 'text/html' }
    });
}
