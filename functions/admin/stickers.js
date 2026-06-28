function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var DEFAULT_STICKERS = [
    { id: 'blue-white',   name: 'Blue',   color: 'White', image: 'images/Blue_Sticker.png',   category: 'color' },
    { id: 'blue-black',   name: 'Blue',   color: 'Black', image: 'images/Blue_Sticker.png',   category: 'color' },
    { id: 'red-white',    name: 'Red',    color: 'White', image: 'images/Red_Sticker.png',    category: 'color' },
    { id: 'red-black',    name: 'Red',    color: 'Black', image: 'images/Red_Sticker.png',    category: 'color' },
    { id: 'green-white',  name: 'Green',  color: 'White', image: 'images/Green_Sticker.png',  category: 'color' },
    { id: 'green-black',  name: 'Green',  color: 'Black', image: 'images/Green_Sticker.png',  category: 'color' },
    { id: 'purple-white', name: 'Purple', color: 'White', image: 'images/Purple_Sticker.png', category: 'color' },
    { id: 'purple-black', name: 'Purple', color: 'Black', image: 'images/Purple_Sticker.png', category: 'color' },
    { id: 'orange-white', name: 'Orange', color: 'White', image: 'images/Orange_Sticker.png', category: 'color' },
    { id: 'orange-black', name: 'Orange', color: 'Black', image: 'images/Orange_Sticker.png', category: 'color' },
    { id: 'pink-white',   name: 'Pink',   color: 'White', image: 'images/Pink_Sticker.png',   category: 'color' },
    { id: 'pink-black',   name: 'Pink',   color: 'Black', image: 'images/Pink_Sticker.png',   category: 'color' },
    { id: 'black-white',  name: 'Black',  color: 'White', image: 'images/Black_Sticker.png',  category: 'color' },
    { id: 'grey-white',   name: 'Grey',   color: 'White', image: 'images/Grey_Sticker.png',   category: 'color' }
];

function renderPage(stickers, message) {
    var rows = stickers.map(function(s, i) {
        var imgSrc = s.image || '';
        if (imgSrc && imgSrc.indexOf('://') === -1 && !imgSrc.startsWith('/')) imgSrc = '/' + imgSrc;
        var imgHtml = imgSrc ? '<img src="' + escapeHtml(imgSrc) + '" style="width:50px;height:50px;object-fit:contain;border-radius:4px;background:' + (s.color === 'White' ? '#ffffff' : '#1e1e1e') + ';vertical-align:middle">' : '\u2014';
        return '<tr>' +
            '<td>' + imgHtml + '</td>' +
            '<td>' + escapeHtml(s.name) + '</td>' +
            '<td>' + escapeHtml(s.color) + '</td>' +
            '<td>' + escapeHtml(s.id) + '</td>' +
            '<td>' +
            '<button class="btn-edit" data-index="' + i + '">Edit</button> ' +
            '<button class="btn-delete" data-index="' + i + '" style="background:#6b0000">Delete</button>' +
            '</td>' +
            '</tr>';
    }).join('');

    return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Stickers \u2014 BIKFAM Admin</title>' +
    '<style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;background:#0a0a0a;color:#eee;font-family:system-ui,sans-serif}' +
    '.header{background:#151515;padding:1rem 2rem;display:flex;align-items:center;gap:2rem;border-bottom:1px solid #222}' +
    '.header h1{margin:0;font-size:1.25rem}' +
    '.header .red{color:#d90429}' +
    '.header a{color:#888;text-decoration:none;font-size:0.875rem}' +
    '.header a:hover{color:#d90429}' +
    '.header .nav-links{display:flex;gap:1rem}' +
    '.header .nav-links a.active{color:#d90429}' +
    '.content{padding:2rem}' +
    '.msg{background:rgba(217,4,41,0.15);border:1px solid #d90429;color:#d90429;padding:0.75rem 1rem;border-radius:4px;margin-bottom:1rem}' +
    'table{width:100%;border-collapse:collapse;margin-bottom:2rem}' +
    'th{text-align:left;padding:0.75rem 0.5rem;border-bottom:2px solid #333;color:#888;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em}' +
    'td{padding:0.75rem 0.5rem;border-bottom:1px solid #1e1e1e;vertical-align:middle}' +
    'tr:hover td{background:#111}' +
    'button{padding:0.4rem 0.75rem;background:#d90429;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:0.8rem}' +
    'button:hover{background:#b00322}' +
    'button.btn-secondary{background:#333}' +
    'button.btn-secondary:hover{background:#555}' +
    '.add-btn{margin-bottom:1rem;padding:0.6rem 1.2rem;font-size:0.9rem}' +
    '.form-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:1000;align-items:center;justify-content:center}' +
    '.form-overlay.open{display:flex}' +
    '.form-box{background:#151515;border:1px solid #333;border-radius:8px;padding:2rem;width:100%;max-width:500px}' +
    '.form-box h2{margin:0 0 1.5rem;font-size:1.3rem}' +
    '.form-group{margin-bottom:1rem}' +
    '.form-group label{display:block;font-size:0.8rem;color:#eee;margin-bottom:0.3rem}' +
    '.form-group .help-text{font-size:0.75rem;color:#666;margin-top:0.25rem;line-height:1.4}' +
    '.form-group input,.form-group select{width:100%;padding:0.6rem;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#eee;font-size:0.9rem;outline:none}' +
    '.form-group input:focus,.form-group select:focus{border-color:#d90429}' +
    '.form-group ::placeholder{color:#555;font-style:italic}' +
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}' +
    '.form-actions{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem}' +
    '.empty{text-align:center;padding:3rem;color:#888}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<h1><span class="red">BIK</span>FAM Admin</h1>' +
    '<div class="nav-links">' +
    '<a href="/admin">Orders</a>' +
    '<a href="/admin/products">Products</a>' +
    '<a href="/admin/stickers" class="active">Stickers</a>' +
    '</div>' +
    '<a href="/admin/logout" style="margin-left:auto">Sign Out</a>' +
    '</div>' +
    '<div class="content">' +
    (message ? '<div class="msg">' + escapeHtml(message) + '</div>' : '') +
    '<button class="add-btn" id="add-btn">+ Add Sticker</button>' +
    '<p style="color:#666;font-size:0.85rem;margin-top:-0.5rem;margin-bottom:1rem">These are the sticker options available in the Custom 12-Pack Builder. Each sticker has a name, color variant, and image.</p>' +
    (stickers.length === 0 ?
        '<div class="empty"><p>No stickers yet.</p></div>' :
        '<table><thead><tr><th>Image</th><th>Name</th><th>Color</th><th>ID</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table>') +
    '</div>' +

    '<div class="form-overlay" id="form-overlay">' +
    '<div class="form-box">' +
    '<h2 id="form-title">Add Sticker</h2>' +
    '<form method="POST" action="/admin/stickers" id="sticker-form" enctype="multipart/form-data">' +
    '<input type="hidden" name="action" value="save">' +
    '<input type="hidden" name="edit_index" id="edit-index" value="">' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Sticker Name</label>' +
    '<input type="text" name="name" id="sticker-name" required placeholder="e.g. Blue, Red, Neon Green">' +
    '<div class="help-text">What this sticker is called. Example: <strong>Blue</strong>, <strong>Red</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Color Variant</label>' +
    '<select name="color" id="sticker-color" required>' +
    '<option value="White">White (light background preview)</option>' +
    '<option value="Black">Black (dark background preview)</option>' +
    '</select>' +
    '<div class="help-text"><strong>White</strong> stickers show on a light background, <strong>Black</strong> on a dark one. This only affects the preview in the builder.</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Upload Sticker Image</label>' +
    '<input type="file" name="image_file" accept="image/png,image/jpeg,image/webp">' +
    '<div class="help-text">Upload a PNG or JPEG of the sticker design.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use existing image path</label>' +
    '<input type="text" name="image" placeholder="e.g. images/Blue_Sticker.png">' +
    '<div class="help-text">If the image is already on the server, type its path instead. Example: <strong>images/Blue_Sticker.png</strong></div>' +
    '</div>' +
    '<div class="form-actions">' +
    '<button type="button" class="btn-secondary" id="form-cancel">Cancel</button>' +
    '<button type="submit">Save Sticker</button>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>' +

    '<script>' +
    'var stickers = ' + JSON.stringify(stickers) + ';' +
    'var overlay = document.getElementById("form-overlay");' +

    'document.getElementById("add-btn").addEventListener("click", function() {' +
    '  document.getElementById("form-title").textContent = "Add Sticker";' +
    '  document.getElementById("edit-index").value = "";' +
    '  document.getElementById("sticker-form").reset();' +
    '  overlay.classList.add("open");' +
    '});' +
    'document.getElementById("form-cancel").addEventListener("click", function() { overlay.classList.remove("open"); });' +

    'document.querySelectorAll(".btn-edit").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var s = stickers[idx];' +
    '    document.getElementById("form-title").textContent = "Edit Sticker";' +
    '    document.getElementById("edit-index").value = idx;' +
    '    document.getElementById("sticker-name").value = s.name || "";' +
    '    document.getElementById("sticker-color").value = s.color || "White";' +
    '    document.querySelector("[name=image]").value = s.image || "";' +
    '    overlay.classList.add("open");' +
    '  });' +
    '});' +

    'document.querySelectorAll(".btn-delete").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    if (!confirm("Delete this sticker?")) return;' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var form = document.createElement("form");' +
    '    form.method = "POST";' +
    '    form.action = "/admin/stickers";' +
    '    var inp = document.createElement("input");' +
    '    inp.type = "hidden"; inp.name = "action"; inp.value = "delete";' +
    '    form.appendChild(inp);' +
    '    var inp2 = document.createElement("input");' +
    '    inp2.type = "hidden"; inp2.name = "delete_index"; inp2.value = idx;' +
    '    form.appendChild(inp2);' +
    '    document.body.appendChild(form);' +
    '    form.submit();' +
    '  });' +
    '});' +

    'overlay.addEventListener("click", function(e) { if (e.target === overlay) overlay.classList.remove("open"); });' +
    '</script>' +
    '</body>' +
    '</html>';
}

export async function onRequest(context) {
    var stickers = null;
    try {
        var obj = await context.env.DECAL_UPLOADS.get('products/stickers.json');
        if (obj) {
            stickers = JSON.parse(await obj.text());
        }
    } catch (e) {}

    if (!stickers || !Array.isArray(stickers) || stickers.length === 0) {
        stickers = JSON.parse(JSON.stringify(DEFAULT_STICKERS));
        try {
            await context.env.DECAL_UPLOADS.put('products/stickers.json', JSON.stringify(stickers));
        } catch (e) {}
    }

    var url = new URL(context.request.url);
    var msg = url.searchParams.get('msg') || null;

    if (context.request.method === 'POST') {
        var formData = await context.request.formData();
        var action = formData.get('action');

        if (action === 'delete') {
            var idx = parseInt(formData.get('delete_index'));
            if (!isNaN(idx) && idx >= 0 && idx < stickers.length) {
                stickers.splice(idx, 1);
                await context.env.DECAL_UPLOADS.put('products/stickers.json', JSON.stringify(stickers));
                return new Response('', { status: 302, headers: { 'Location': '/admin/stickers?msg=Sticker+deleted.' } });
            }
        }

        if (action === 'save') {
            var name = formData.get('name');
            var color = formData.get('color');
            var editIndex = formData.get('edit_index');

            var id = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') + '-' + (color || 'white').toLowerCase();
            var image = formData.get('image') || '';

            // Handle image upload
            var imageFile = formData.get('image_file');
            if (imageFile && imageFile.size > 0) {
                var allowed = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowed.includes(imageFile.type) && imageFile.size <= 10 * 1024 * 1024) {
                    var ext = imageFile.name.split('.').pop();
                    var key = 'sticker-images/' + id + '-' + Date.now() + '.' + ext;
                    await context.env.DECAL_UPLOADS.put(key, await imageFile.arrayBuffer());
                    image = '/' + key;
                }
            }

            var sticker = { id: id, name: name, color: color, image: image, category: 'color' };

            if (editIndex !== null && editIndex !== '') {
                var editIdx = parseInt(editIndex);
                if (!isNaN(editIdx) && editIdx >= 0 && editIdx < stickers.length) {
                    stickers[editIdx] = sticker;
                }
            } else {
                stickers.push(sticker);
            }

            await context.env.DECAL_UPLOADS.put('products/stickers.json', JSON.stringify(stickers));
            return new Response('', { status: 302, headers: { 'Location': '/admin/stickers?msg=Sticker+saved.' } });
        }
    }

    return new Response(renderPage(stickers, msg), {
        headers: { 'Content-Type': 'text/html' }
    });
}
