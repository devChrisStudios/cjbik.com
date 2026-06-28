function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var DEFAULT_CATALOG = {
    "products": [
        {
            "type": "pack",
            "id": "standard-pack",
            "name": "Standard Pack",
            "price": 8.99,
            "image": "images/Mixed_Pack.png",
            "description": "The best of both worlds \u2014 six white stickers and six black stickers in one 12-pack. Perfect for any surface, any style.",
            "longDescription": "The best of both worlds \u2014 six white stickers and six black stickers in one 12-pack. Covers light and dark surfaces. Weather-resistant and built to last.",
            "badge": "Mixed \u2014 6 White + 6 Black",
            "badgeClass": "color-badge-white",
            "features": [
                "6x White laminate stickers (various designs)",
                "6x Black laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" \u00d7 3\""
            ],
            "featured": true
        },
        {
            "type": "pack",
            "id": "white-pack",
            "name": "White 12-Pack",
            "price": 9.99,
            "image": "images/White_Pack.png",
            "description": "Twelve high-quality white laminate stickers. Perfect for dark surfaces.",
            "longDescription": "Twelve high-quality white laminate stickers. These look amazing on dark surfaces \u2014 helmets, bike frames, laptops, toolboxes, you name it.",
            "badge": "White Stickers",
            "badgeClass": "color-badge-white",
            "features": [
                "12x White laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" \u00d7 3\""
            ],
            "featured": true
        },
        {
            "type": "pack",
            "id": "black-pack",
            "name": "Black 12-Pack",
            "price": 9.99,
            "image": "images/Black_Pack.png",
            "description": "Twelve premium black stickers with a matte finish. Sleek and stealthy.",
            "longDescription": "Twelve premium black laminate stickers with a matte finish. Sleek, stealthy, and perfect for light-colored surfaces. Same durable construction.",
            "badge": "Black Stickers",
            "badgeClass": "color-badge-black",
            "features": [
                "12x Black laminate stickers (various designs)",
                "Weather-resistant laminate",
                "Each sticker approx. 3\" \u00d7 3\""
            ],
            "featured": true
        },
        {
            "type": "decal",
            "id": "odi-standard",
            "name": "ODI Plate Decal",
            "price": 15.99,
            "baseImage": "images/ODI_White.png",
            "imagePrefix": "ODI",
            "description": "Premium laminate decal for your ODI plate. Pick your color below.",
            "colors": ["White", "Blue", "Orange", "Red", "Purple", "Yellow", "Pink", "Green"],
            "hasHandle": true,
            "handleDefault": "@cjbik"
        },
        {
            "type": "decal",
            "id": "motocutz-standard",
            "name": "Motocutz Plate Decal",
            "price": 15.99,
            "baseImage": "images/Motocutz_White.png",
            "imagePrefix": "Motocutz",
            "description": "Premium laminate decal for your motocross plate. Pick your color below.",
            "colors": ["White", "Blue", "Orange", "Red", "Purple", "Yellow", "Pink", "Green"],
            "hasHandle": true,
            "handleDefault": "@cjbik"
        },
        {
            "type": "custom-decal",
            "id": "custom-decal-odi",
            "name": "ODI Plate Decal",
            "price": 15.99,
            "badge": "ODI",
            "badgeClass": "color-badge-white",
            "description": "Design your ODI plate decal on Motocutz, then upload your artwork here.",
            "designLink": "https://motocutzmx.com/products/surron-number-plate-decal-custom",
            "designLinkText": "Design on Motocutz \u2192",
            "hasUpload": true
        },
        {
            "type": "custom-decal",
            "id": "custom-decal-motocutz",
            "name": "Motocutz Plate Decal",
            "price": 15.99,
            "badge": "Motocutz",
            "badgeClass": "color-badge-white",
            "description": "Design your custom motocross plate decal on Motocutz, then upload your artwork here.",
            "designLink": "https://motocutzmx.com/products/custom-og-motocutz-number-plate-decal",
            "designLinkText": "Design on Motocutz \u2192",
            "hasUpload": true
        }
    ]
};

function renderPage(catalog, message) {
    var products = (catalog && catalog.products) || [];
    var rows = products.map(function(p, i) {
        var typeLabel = {
            pack: 'Pack',
            decal: 'Decal',
            'custom-decal': 'Custom Decal'
        }[p.type] || p.type;
        var imgSrc = p.image || p.baseImage || '';
        var imgHtml = imgSrc ? '<img src="' + escapeHtml(imgSrc) + '" style="width:50px;height:50px;object-fit:contain;border-radius:4px;background:#1e1e1e;vertical-align:middle">' : '\u2014';
        return '<tr>' +
            '<td>' + imgHtml + '</td>' +
            '<td>' + escapeHtml(p.id) + '</td>' +
            '<td>' + escapeHtml(p.name) + '</td>' +
            '<td><span class="type-badge type-' + p.type + '">' + escapeHtml(typeLabel) + '</span></td>' +
            '<td>$' + (p.price || 0).toFixed(2) + '</td>' +
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
    '<title>Products \u2014 BIKFAM Admin</title>' +
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
    '.type-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:0.75rem}' +
    '.type-pack{background:#1a3a1a;color:#4caf50}' +
    '.type-decal{background:#1a2a3a;color:#42a5f5}' +
    '.type-custom-decal{background:#3a1a2a;color:#ff7043}' +
    'button{padding:0.4rem 0.75rem;background:#d90429;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:0.8rem}' +
    'button:hover{background:#b00322}' +
    'button.btn-secondary{background:#333}' +
    'button.btn-secondary:hover{background:#555}' +
    '.add-btn{margin-bottom:1rem;padding:0.6rem 1.2rem;font-size:0.9rem}' +
    '.form-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:1000;align-items:center;justify-content:center}' +
    '.form-overlay.open{display:flex}' +
    '.form-box{background:#151515;border:1px solid #333;border-radius:8px;padding:2rem;width:100%;max-width:640px;max-height:90vh;overflow-y:auto}' +
    '.form-box h2{margin:0 0 1.5rem;font-size:1.3rem}' +
    '.form-group{margin-bottom:1rem}' +
    '.form-group label{display:block;font-size:0.8rem;color:#eee;margin-bottom:0.3rem}' +
    '.form-group .help-text{font-size:0.75rem;color:#666;margin-top:0.25rem;line-height:1.4}' +
    '.form-group input,.form-group select,.form-group textarea{width:100%;padding:0.6rem;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#eee;font-size:0.9rem;outline:none}' +
    '.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#d90429}' +
    '.form-group textarea{resize:vertical;min-height:60px}' +
    '.form-group ::placeholder{color:#555;font-style:italic}' +
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}' +
    '.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}' +
    '.form-actions{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.5rem}' +
    '.empty{text-align:center;padding:3rem;color:#888}' +
    '.type-fields{display:none}' +
    '.type-fields.active{display:block}' +
    '.type-desc{padding:0.75rem;background:#1e1e1e;border-left:3px solid #d90429;border-radius:4px;font-size:0.85rem;color:#aaa;margin-bottom:1rem}' +
    '.form-section-title{font-size:0.85rem;color:#d90429;margin:1.25rem 0 0.75rem;padding-bottom:0.4rem;border-bottom:1px solid #222}' +
    '.custom-type-row{display:none}' +
    '.custom-type-row.show{display:block}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="header">' +
    '<h1><span class="red">BIK</span>FAM Admin</h1>' +
    '<div class="nav-links">' +
    '<a href="/admin">Orders</a>' +
    '<a href="/admin/products" class="active">Products</a>' +
    '</div>' +
    '<a href="/admin/logout" style="margin-left:auto">Sign Out</a>' +
    '</div>' +
    '<div class="content">' +
    (message ? '<div class="msg">' + escapeHtml(message) + '</div>' : '') +
    '<button class="add-btn" id="add-btn">+ Add Product</button>' +
    (products.length === 0 ?
        '<div class="empty"><p>No products yet. Add your first product above.</p></div>' :
        '<table><thead><tr><th>Image</th><th>ID</th><th>Name</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table>') +
    '</div>' +

    // Product form overlay
    '<div class="form-overlay" id="form-overlay">' +
    '<div class="form-box">' +
    '<h2 id="form-title">Add Product</h2>' +
    '<form method="POST" action="/admin/products" id="product-form" enctype="multipart/form-data">' +
    '<input type="hidden" name="action" value="save">' +
    '<input type="hidden" name="edit_index" id="edit-index" value="">' +

    // ========== TYPE & ID ==========
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Product Type</label>' +
    '<select name="type" id="product-type" required>' +
    '<option value="">\u2014 Select a type \u2014</option>' +
    '<option value="pack">\uD83D\uDCE6 Pack \u2014 a bundle sold together</option>' +
    '<option value="decal">\uD83C\uDFA8 Decal \u2014 single item with color choices</option>' +
    '<option value="custom-decal">\u270F\uFE0F Custom Decal \u2014 customer uploads their own design</option>' +
    '<option value="__other__">\u2795 Other \u2014 a completely new type of product</option>' +
    '</select>' +
    '<div class="help-text">What kind of product is this? Pick a type above. If none fit, pick <strong>Other</strong> and type your own.</div>' +
    '</div>' +
    '<div class="form-group custom-type-row" id="custom-type-row">' +
    '<label>Custom Type Name</label>' +
    '<input type="text" name="custom_type_name" id="custom-type-name" placeholder="e.g. shirt, hat, hoodie">' +
    '<div class="help-text">Type anything here to create a new product category. A programmer will need to add support for displaying this type on the shop page.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Internal ID</label>' +
    '<input type="text" name="id" id="product-id" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only" placeholder="e.g. standard-pack">' +
    '<div class="help-text">A unique code used in the system. Use <strong>lowercase</strong> letters, numbers, and hyphens. Auto-filled from the product name. Example: <strong>standard-pack</strong>, <strong>odi-standard</strong></div>' +
    '</div>' +
    '</div>' +

    // ========== NAME & PRICE ==========
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Product Name</label>' +
    '<input type="text" name="name" id="product-name" required placeholder="e.g. Standard Pack, ODI Plate Decal">' +
    '<div class="help-text">What customers see on the shop page. Keep it short and clear.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Price ($)</label>' +
    '<input type="number" name="price" id="product-price" step="0.01" min="0" required placeholder="e.g. 9.99">' +
    '<div class="help-text">How much this costs. Example: <strong>9.99</strong> for $9.99</div>' +
    '</div>' +
    '</div>' +

    // ========== DESCRIPTION ==========
    '<div class="form-group">' +
    '<label>Short Description</label>' +
    '<textarea name="description" id="product-description" required placeholder="e.g. Twelve high-quality white laminate stickers. Perfect for dark surfaces."></textarea>' +
    '<div class="help-text">A 1\u20132 sentence summary that appears on the product card.</div>' +
    '</div>' +

    // ========== PACK FIELDS ==========
    '<div class="type-fields" id="fields-pack">' +
    '<div class="type-desc">A <strong>Pack</strong> is a bundle of multiple items sold together. The shop shows a card with the image, description, bullet points, and an "Add to Cart" button.</div>' +
    '<div class="form-section-title">Pack Details</div>' +
    '<div class="form-group">' +
    '<label>Full Description (optional)</label>' +
    '<textarea name="longDescription" placeholder="e.g. Twelve high-quality white laminate stickers with a weather-resistant finish. Perfect for dark surfaces like helmets, bikes, and laptops."></textarea>' +
    '<div class="help-text">A longer description shown in more detail. If blank, the short description is used instead.</div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Label / Badge</label>' +
    '<input type="text" name="badge" placeholder="e.g. White Stickers, Mixed \u2014 6 White + 6 Black">' +
    '<div class="help-text">A short tag shown on the product card. Example: <strong>White Stickers</strong> or <strong>Black Stickers</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Style</label>' +
    '<select name="badgeClass"><option value="color-badge-white">Light text on dark background</option><option value="color-badge-black">Dark text on light background</option></select>' +
    '<div class="help-text">Use <strong>Light text on dark</strong> for light-colored badges. Use <strong>Dark text on light</strong> for dark badges like "Black Stickers".</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Bullet Points (one per line)</label>' +
    '<textarea name="features" placeholder="e.g. 12x White laminate stickers (various designs)&#10;Weather-resistant laminate&#10;Each sticker approx. 3\u201d \u00d7 3\u201d"></textarea>' +
    '<div class="help-text">Each line becomes a bullet point on the product card.</div>' +
    '</div>' +
    '<div class="form-section-title">Image</div>' +
    '<div class="form-group">' +
    '<label>Upload Product Image</label>' +
    '<input type="file" name="image_file" accept="image/png,image/jpeg,image.webp">' +
    '<div class="help-text">Upload a photo of the product. PNG, JPEG, or WebP under 10MB.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use an existing image path (leave upload empty)</label>' +
    '<input type="text" name="image" placeholder="e.g. images/Mixed_Pack.png">' +
    '<div class="help-text">If the image is already on the server, type its path here instead of uploading. Example: <strong>images/Mixed_Pack.png</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="featured" value="true"> Show on the home page</label>' +
    '<div class="help-text" style="margin-left:1.3rem">Check this to feature this product in the "Featured Packs" section on the home page.</div>' +
    '</div>' +
    '</div>' +

    // ========== DECAL FIELDS ==========
    '<div class="type-fields" id="fields-decal">' +
    '<div class="type-desc">A <strong>Decal</strong> is a single sticker sold in multiple color options. Customers pick a color and can enter their Instagram handle. The decal card shows color swatches and a handle input field.</div>' +
    '<div class="form-section-title">Images &amp; Colors</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Upload Base Image (the White version)</label>' +
    '<input type="file" name="base_image_file" accept="image/png,image/jpeg,image.webp">' +
    '<div class="help-text">Upload the white version of your decal. This is the default image shown when the page loads.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use an existing image path (leave upload empty)</label>' +
    '<input type="text" name="baseImage" placeholder="e.g. images/ODI_White.png">' +
    '<div class="help-text">If the image is already on the server, type its path. Example: <strong>images/ODI_White.png</strong></div>' +
    '</div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Image Filename Prefix</label>' +
    '<input type="text" name="imagePrefix" id="image-prefix" placeholder="e.g. ODI" style="text-transform:capitalize">' +
    '<div class="help-text">Your color images must be named <strong>{Prefix}_{Color}.png</strong>. For example, if prefix is <strong>ODI</strong>, you need files like: <code>ODI_White.png</code>, <code>ODI_Blue.png</code>, <code>ODI_Red.png</code>. Auto-filled from the product name.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Available Colors</label>' +
    '<input type="text" name="colors" id="decal-colors" placeholder="e.g. White, Blue, Red, Green, Purple, Orange, Yellow, Pink">' +
    '<div class="help-text">Color names separated by <strong>commas</strong>. Each color needs a matching image file. Standard options: <strong>White, Blue, Red, Green, Purple, Orange, Yellow, Pink</strong></div>' +
    '</div>' +
    '</div>' +
    '<div class="form-section-title">Instagram Handle</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="hasHandle" value="true" checked> Let customers enter their Instagram @handle</label>' +
    '<div class="help-text" style="margin-left:1.3rem">If checked, a text field appears on the product card for the customer\u2019s Instagram handle. The handle gets printed on the decal.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Default Handle Text</label>' +
    '<input type="text" name="handleDefault" placeholder="e.g. @cjbik">' +
    '<div class="help-text">The placeholder text shown in the handle input. Example: <strong>@cjbik</strong></div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // ========== CUSTOM DECAL FIELDS ==========
    '<div class="type-fields" id="fields-custom-decal">' +
    '<div class="type-desc">A <strong>Custom Decal</strong> lets customers design their own decal on an external website (like Motocutz), then upload their artwork here. You receive the design and print + ship the custom decal.</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Label / Badge Text</label>' +
    '<input type="text" name="badge" placeholder="e.g. ODI, Motocutz">' +
    '<div class="help-text">A short label shown on the product card. Example: <strong>ODI</strong> or <strong>Motocutz</strong></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Style</label>' +
    '<select name="badgeClass"><option value="color-badge-white">Light text on dark background</option><option value="color-badge-black">Dark text on light background</option></select>' +
    '<div class="help-text">The color scheme for the badge label.</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-section-title">External Design Link</div>' +
    '<div class="form-group">' +
    '<label>Design Page URL</label>' +
    '<input type="url" name="designLink" placeholder="e.g. https://motocutzmx.com/products/custom...">' +
    '<div class="help-text">The full URL to the external site where customers design their decal. Opens in a new tab.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Button Text for the Link</label>' +
    '<input type="text" name="designLinkText" placeholder="e.g. Design on Motocutz \u2192">' +
    '<div class="help-text">The text shown on the button that goes to the external design page.</div>' +
    '</div>' +
    '</div>' +

    // ========== OTHER / CUSTOM FIELDS ==========
    '<div class="type-fields" id="fields-__other__">' +
    '<div class="type-desc">Creating a <strong>custom product type</strong>? Fill in whatever fields are relevant below. A programmer will need to update the shop page to know how to display this new type.</div>' +

    '<div class="form-section-title">Images</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Upload Main Image</label>' +
    '<input type="file" name="image_file" accept="image/png,image/jpeg,image.webp">' +
    '<div class="help-text">Upload the main product photo. PNG, JPEG, or WebP under 10MB.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Or use an existing image path</label>' +
    '<input type="text" name="image" placeholder="e.g. images/MyProduct.png">' +
    '<div class="help-text">Path to an existing image on the server.</div>' +
    '</div>' +
    '</div>' +

    '<div class="form-section-title">Details</div>' +
    '<div class="form-group">' +
    '<label>Full Description (optional)</label>' +
    '<textarea name="longDescription" placeholder="e.g. A detailed description of the product..."></textarea>' +
    '<div class="help-text">A longer description. If blank, the short description is used.</div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Label / Badge</label>' +
    '<input type="text" name="badge" placeholder="e.g. Limited Edition, Premium">' +
    '<div class="help-text">A short tag shown on the product card.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Badge Style</label>' +
    '<select name="badgeClass"><option value="color-badge-white">Light text on dark background</option><option value="color-badge-black">Dark text on light background</option></select>' +
    '<div class="help-text">The color scheme for the badge label.</div>' +
    '</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Bullet Points (one per line)</label>' +
    '<textarea name="features" placeholder="e.g. Premium quality&#10;Weather-resistant&#10;Easy to apply"></textarea>' +
    '<div class="help-text">Each line becomes a bullet point on the product card.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="featured" value="true"> Show on the home page</label>' +
    '<div class="help-text" style="margin-left:1.3rem">Feature this product on the home page.</div>' +
    '</div>' +

    '<div class="form-section-title">Color Options (optional)</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label>Color Image Prefix</label>' +
    '<input type="text" name="imagePrefix" placeholder="e.g. ODI">' +
    '<div class="help-text">If this product comes in colors, the image files should be named <strong>{Prefix}_{Color}.png</strong>.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Available Colors (comma-separated)</label>' +
    '<input type="text" name="colors" placeholder="e.g. White, Blue, Red">' +
    '<div class="help-text">Color names separated by commas. Each needs a matching image file.</div>' +
    '</div>' +
    '</div>' +

    '<div class="form-section-title">Customizations (optional)</div>' +
    '<div class="form-row">' +
    '<div class="form-group">' +
    '<label><input type="checkbox" name="hasHandle" value="true"> Let customers enter their Instagram @handle</label>' +
    '<div class="help-text" style="margin-left:1.3rem">Show a text field for the customer\u2019s Instagram handle.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Default Handle Text</label>' +
    '<input type="text" name="handleDefault" placeholder="e.g. @cjbik">' +
    '<div class="help-text">Placeholder text for the handle field.</div>' +
    '</div>' +
    '</div>' +

    '<div class="form-section-title">External Link (optional)</div>' +
    '<div class="form-group">' +
    '<label>External Design URL</label>' +
    '<input type="url" name="designLink" placeholder="e.g. https://example.com/design">' +
    '<div class="help-text">A URL to an external page where customers can customize or learn more.</div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>Button Text for the Link</label>' +
    '<input type="text" name="designLinkText" placeholder="e.g. Design Yours \u2192">' +
    '<div class="help-text">The button text for the external link.</div>' +
    '</div>' +
    '</div>' +

    '<div class="form-actions">' +
    '<button type="button" class="btn-secondary" id="form-cancel">Cancel</button>' +
    '<button type="submit">Save Product</button>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>' +

    '<script>' +
    'var products = ' + JSON.stringify(products) + ';' +

    // Type switching - show/hide fields based on type
    'var typeSelect = document.getElementById("product-type");' +
    'var customTypeRow = document.getElementById("custom-type-row");' +
    'var customTypeName = document.getElementById("custom-type-name");' +
    'function showFields() {' +
    '  document.querySelectorAll(".type-fields").forEach(function(el) { el.classList.remove("active"); });' +
    '  var val = typeSelect.value;' +
    '  if (val === "__other__") {' +
    '    customTypeRow.classList.add("show");' +
    '    customTypeName.required = true;' +
    '    var f = document.getElementById("fields-__other__");' +
    '    if (f) f.classList.add("active");' +
    '  } else if (val) {' +
    '    customTypeRow.classList.remove("show");' +
    '    customTypeName.required = false;' +
    '    var f = document.getElementById("fields-" + val);' +
    '    if (f) f.classList.add("active");' +
    '  } else {' +
    '    customTypeRow.classList.remove("show");' +
    '    customTypeName.required = false;' +
    '  }' +
    '}' +
    'typeSelect.addEventListener("change", showFields);' +
    'showFields();' +

    // Auto-generate ID and image prefix from name
    'document.getElementById("product-name").addEventListener("input", function() {' +
    '  var idField = document.getElementById("product-id");' +
    '  if (idField.readOnly) return;' +
    '  var slug = this.value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\\s+/g, "-").replace(/^-+|-+$/g, "");' +
    '  if (slug) idField.value = slug;' +
    '  var prefixField = document.getElementById("image-prefix");' +
    '  if (prefixField) {' +
    '    var prefix = this.value.replace(/\\(.*?\\)/g, "").replace(/Decal|Plate|Pack|Sticker/gi, "").trim();' +
    '    prefix = prefix.replace(/\\s+/g, "_");' +
    '    prefix = prefix.replace(/(?:^|_)(.)/g, function(m, c) { return c.toUpperCase(); });' +
    '    if (prefix) prefixField.value = prefix;' +
    '  }' +
    '});' +

    // Form overlay open/close
    'var overlay = document.getElementById("form-overlay");' +
    'document.getElementById("add-btn").addEventListener("click", function() {' +
    '  document.getElementById("form-title").textContent = "Add Product";' +
    '  document.getElementById("edit-index").value = "";' +
    '  document.getElementById("product-form").reset();' +
    '  document.getElementById("product-id").readOnly = false;' +
    '  overlay.classList.add("open");' +
    '  showFields();' +
    '});' +
    'document.getElementById("form-cancel").addEventListener("click", function() {' +
    '  overlay.classList.remove("open");' +
    '  document.getElementById("product-id").readOnly = false;' +
    '  customTypeName.required = false;' +
    '});' +

    // Edit buttons - populate ALL known fields from product data
    'document.querySelectorAll(".btn-edit").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var p = products[idx];' +
    '    document.getElementById("form-title").textContent = "Edit Product";' +
    '    document.getElementById("edit-index").value = idx;' +
    '    document.getElementById("product-id").readOnly = true;' +

    // Basic fields
    '    var typeVal = p.type;' +
    '    if (["pack","decal","custom-decal"].indexOf(typeVal) === -1) typeVal = "__other__";' +
    '    document.getElementById("product-type").value = typeVal;' +
    '    document.getElementById("product-id").value = p.id || "";' +
    '    document.getElementById("product-name").value = p.name || "";' +
    '    document.getElementById("product-price").value = p.price || "";' +
    '    document.getElementById("product-description").value = p.description || "";' +
    '    if (typeVal === "__other__") {' +
    '      document.getElementById("custom-type-name").value = p.type;' +
    '      customTypeName.required = true;' +
    '    }' +

    // All optional fields
    '    document.querySelector("[name=image]").value = p.image || "";' +
    '    document.querySelector("[name=baseImage]").value = p.baseImage || "";' +
    '    document.querySelector("[name=imagePrefix]").value = p.imagePrefix || "";' +
    '    document.querySelector("[name=longDescription]").value = p.longDescription || "";' +
    '    document.querySelector("[name=badge]").value = p.badge || "";' +
    '    var badgeEl = document.querySelector("[name=badgeClass]");' +
    '    if (badgeEl) badgeEl.value = p.badgeClass || "color-badge-white";' +
    '    document.querySelector("[name=features]").value = (p.features || []).join("\\n");' +
    '    var featuredEl = document.querySelector("[name=featured]");' +
    '    if (featuredEl) featuredEl.checked = p.featured === true;' +
    '    document.querySelector("[name=colors]").value = (p.colors || []).join(", ");' +
    '    var hasHandleEl = document.querySelector("[name=hasHandle]");' +
    '    if (hasHandleEl) hasHandleEl.checked = p.hasHandle !== false;' +
    '    document.querySelector("[name=handleDefault]").value = p.handleDefault || "";' +
    '    document.querySelector("[name=designLink]").value = p.designLink || "";' +
    '    document.querySelector("[name=designLinkText]").value = p.designLinkText || "";' +

    '    showFields();' +
    '    overlay.classList.add("open");' +
    '  });' +
    '});' +

    // Delete buttons
    'document.querySelectorAll(".btn-delete").forEach(function(btn) {' +
    '  btn.addEventListener("click", function() {' +
    '    if (!confirm("Delete this product?")) return;' +
    '    var idx = parseInt(this.dataset.index);' +
    '    var form = document.createElement("form");' +
    '    form.method = "POST";' +
    '    form.action = "/admin/products";' +
    '    var inp = document.createElement("input");' +
    '    inp.type = "hidden";' +
    '    inp.name = "action";' +
    '    inp.value = "delete";' +
    '    form.appendChild(inp);' +
    '    var inp2 = document.createElement("input");' +
    '    inp2.type = "hidden";' +
    '    inp2.name = "delete_index";' +
    '    inp2.value = idx;' +
    '    form.appendChild(inp2);' +
    '    document.body.appendChild(form);' +
    '    form.submit();' +
    '  });' +
    '});' +

    // Close overlay on background click
    'overlay.addEventListener("click", function(e) {' +
    '  if (e.target === overlay) {' +
    '    overlay.classList.remove("open");' +
    '    document.getElementById("product-id").readOnly = false;' +
    '    customTypeName.required = false;' +
    '  }' +
    '});' +
    '</script>' +

    '</body>' +
    '</html>';
}

export async function onRequest(context) {
    var catalog = null;
    try {
        var obj = await context.env.DECAL_UPLOADS.get('products/catalog.json');
        if (obj) {
            catalog = JSON.parse(await obj.text());
        }
    } catch (e) {}

    // Seed with DEFAULT_CATALOG if R2 is empty (first visit)
    if (!catalog || !catalog.products || catalog.products.length === 0) {
        catalog = JSON.parse(JSON.stringify(DEFAULT_CATALOG));
        try {
            await context.env.DECAL_UPLOADS.put('products/catalog.json', JSON.stringify(catalog));
        } catch (e) {}
    }

    if (context.request.method === 'POST') {
        var formData = await context.request.formData();
        var action = formData.get('action');

        if (action === 'delete') {
            var idx = parseInt(formData.get('delete_index'));
            if (!isNaN(idx) && idx >= 0 && idx < catalog.products.length) {
                catalog.products.splice(idx, 1);
                await context.env.DECAL_UPLOADS.put('products/catalog.json', JSON.stringify(catalog));
                return new Response(renderPage(catalog, 'Product deleted.'), {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        }

        if (action === 'save') {
            var type = formData.get('type');
            var id = formData.get('id');
            var name = formData.get('name');
            var price = parseFloat(formData.get('price')) || 0;
            var description = formData.get('description') || '';
            var editIndex = formData.get('edit_index');

            // If "Other" was selected, use the custom type name
            if (type === '__other__') {
                var customType = formData.get('custom_type_name') || '';
                if (!customType) {
                    return new Response(renderPage(catalog, 'Please enter a custom type name.'), {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
                type = customType.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
            }

            var product = {
                type: type,
                id: id,
                name: name,
                price: price,
                description: description
            };

            // Handle image uploads (for packs and custom types)
            var imageFile = formData.get('image_file');
            var uploadedImagePath = null;
            if (imageFile && imageFile.size > 0) {
                var allowed = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowed.includes(imageFile.type) && imageFile.size <= 10 * 1024 * 1024) {
                    var ext = imageFile.name.split('.').pop();
                    var key = 'product-images/' + id + '-' + Date.now() + '.' + ext;
                    await context.env.DECAL_UPLOADS.put(key, await imageFile.arrayBuffer());
                    uploadedImagePath = '/' + key;
                }
            }

            // Handle base image upload (for decals)
            var baseImageFile = formData.get('base_image_file');
            var uploadedBaseImagePath = null;
            if (baseImageFile && baseImageFile.size > 0) {
                var allowed2 = ['image/png', 'image/jpeg', 'image/webp'];
                if (allowed2.includes(baseImageFile.type) && baseImageFile.size <= 10 * 1024 * 1024) {
                    var ext2 = baseImageFile.name.split('.').pop();
                    var key2 = 'product-images/' + id + '-base-' + Date.now() + '.' + ext2;
                    await context.env.DECAL_UPLOADS.put(key2, await baseImageFile.arrayBuffer());
                    uploadedBaseImagePath = '/' + key2;
                }
            }

            // Save ALL possible fields - they'll be ignored by the shop if not relevant
            product.image = uploadedImagePath || formData.get('image') || undefined;
            product.baseImage = uploadedBaseImagePath || formData.get('baseImage') || undefined;
            product.imagePrefix = formData.get('imagePrefix') || undefined;
            product.longDescription = formData.get('longDescription') || undefined;
            product.badge = formData.get('badge') || undefined;
            product.badgeClass = formData.get('badgeClass') || 'color-badge-white';
            product.featured = formData.get('featured') === 'true';

            var featuresRaw = formData.get('features') || '';
            product.features = featuresRaw.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            if (product.features.length === 0) delete product.features;

            var colorsRaw = formData.get('colors') || '';
            product.colors = colorsRaw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            if (product.colors.length === 0) delete product.colors;

            product.hasHandle = formData.get('hasHandle') === 'true';
            product.handleDefault = formData.get('handleDefault') || undefined;
            product.designLink = formData.get('designLink') || undefined;
            product.designLinkText = formData.get('designLinkText') || undefined;
            product.hasUpload = true;

            // Clean up undefined/empty values for cleaner JSON
            for (var key3 in product) {
                if (product[key3] === undefined || product[key3] === null) {
                    delete product[key3];
                }
            }

            if (editIndex !== null && editIndex !== '') {
                var editIdx = parseInt(editIndex);
                if (!isNaN(editIdx) && editIdx >= 0 && editIdx < catalog.products.length) {
                    catalog.products[editIdx] = product;
                }
            } else {
                catalog.products.push(product);
            }

            await context.env.DECAL_UPLOADS.put('products/catalog.json', JSON.stringify(catalog));
            return new Response(renderPage(catalog, 'Product saved.'), {
                headers: { 'Content-Type': 'text/html' }
            });
        }
    }

    return new Response(renderPage(catalog, null), {
        headers: { 'Content-Type': 'text/html' }
    });
}
