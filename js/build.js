/* ============================================================
   BIKFAM STICKER SHOP - Custom 12-Pack Builder
   ============================================================
   Handles the "Build Your Own 12-Pack" page: renders a grid of
   stickers, handles selection (up to 12), manages a sidebar with
   progress/removal, and adds the completed pack to cart.
   ============================================================ */



// ============================================================
// STICKER CATALOG
// ============================================================
// Edit this array to add, remove, or modify available stickers.
// Each entry: { id, name, color, image, category }

const STICKERS = [
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
    { id: 'black-white',  name: 'Black',  color: 'White',  image: 'images/Black_Sticker.png',  category: 'color' },
    { id: 'grey-white',   name: 'Grey',   color: 'White',  image: 'images/Grey_Sticker.png',   category: 'color' },
];

const MAX_PACK_SIZE = 12;
const PACK_PRICE = 11.99;



// ============================================================
// BUILDER STATE
// ============================================================
// This tracks what the user has selected during their session.
// It's a simple array of sticker IDs that grows/shrinks as
// they click on stickers.

let selectedStickers = [];

document.addEventListener('DOMContentLoaded', function() {
    
    const page = document.body.dataset.page;
    if (page !== 'builder') return;
    
    const grid = document.querySelector('.sticker-grid');
    const sidebar = document.querySelector('.builder-sidebar');
    
    if (!grid) return;
    
    STICKERS.forEach(function(sticker) {
        const option = document.createElement('div');
        option.className = 'sticker-option';
        option.dataset.id = sticker.id;
        
        option.innerHTML = [
            '<div class="sticker-preview" style="background: ' + (sticker.color === 'White' ? '#ffffff' : '#111111') + '">',
            '  <img src="' + sticker.image + '" alt="' + sticker.name + '" class="sticker-img">',
            '  <div class="sticker-count" style="display:none;">×0</div>',
            '</div>',
            '<div class="sticker-name">' + sticker.name + '</div>',
            '<div class="sticker-color">' + sticker.color + '</div>'
        ].join('');
        
        // Click to add one of this sticker
        option.addEventListener('click', function() {
            addSticker(sticker.id);
        });
        
        grid.appendChild(option);
    });
    
    const addToCartBtn = document.querySelector('.btn-add-custom-pack');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (selectedStickers.length !== MAX_PACK_SIZE) return;
            
            const stickerList = selectedStickers.map(function(id) {
                const s = STICKERS.find(function(stk) { return stk.id === id; });
                return s ? s.name + ' (' + s.color + ')' : id;
            });
            
            const packId = 'custom-pack-' + Date.now();
            
            const item = {
                id: packId,
                name: 'Custom 12-Pack',
                price: PACK_PRICE,
                image: '🎨',
                type: 'custom',
                stickers: stickerList,
                stickerIds: selectedStickers
            };
            
            addToCart(item);
            
            selectedStickers = [];
            updateBuilderUI();
        });
    }
    
    updateBuilderUI();
    
});



// ============================================================
// BUILDER LOGIC
// ============================================================


function addSticker(stickerId) {
    if (selectedStickers.length >= MAX_PACK_SIZE) {
        showPackFullWarning();
        return;
    }
    selectedStickers.push(stickerId);
    updateBuilderUI();
}

function removeSticker(stickerId) {
    const index = selectedStickers.indexOf(stickerId);
    if (index !== -1) {
        selectedStickers.splice(index, 1);
        updateBuilderUI();
    }
}

function updateBuilderUI() {
    
    const allOptions = document.querySelectorAll('.sticker-option');
    allOptions.forEach(function(option) {
        const id = option.dataset.id;
        const count = selectedStickers.filter(function(sid) { return sid === id; }).length;
        const countBadge = option.querySelector('.sticker-count');
        
        if (count > 0) {
            option.classList.add('selected');
            countBadge.style.display = 'flex';
            countBadge.textContent = '×' + count;
        } else {
            option.classList.remove('selected');
            countBadge.style.display = 'none';
        }
    });
    
    const countEl = document.querySelector('.count');
    const progressFill = document.querySelector('.progress-fill');
    const selectedList = document.querySelector('.selected-list');
    const addToCartBtn = document.querySelector('.btn-add-custom-pack');
    
    if (countEl) {
        countEl.textContent = selectedStickers.length + '/' + MAX_PACK_SIZE;
    }
    
    if (progressFill) {
        const percent = (selectedStickers.length / MAX_PACK_SIZE) * 100;
        progressFill.style.width = percent + '%';
    }
    
    if (selectedList) {
        selectedList.innerHTML = '';
        
        if (selectedStickers.length === 0) {
            selectedList.innerHTML = '<div class="builder-empty"><div class="empty-icon">🖍️</div><p>Click on stickers above to build your pack!</p></div>';
        } else {
            selectedStickers.forEach(function(stickerId) {
                const sticker = STICKERS.find(function(s) {
                    return s.id === stickerId;
                });
                if (!sticker) return;
                
                const item = document.createElement('div');
                item.className = 'selected-item';
                item.innerHTML = [
                    '<span>' + sticker.name + ' (' + sticker.color + ')</span>',
                    '<button class="remove-btn" data-id="' + sticker.id + '">✕</button>'
                ].join('');
                
                item.querySelector('.remove-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeSticker(sticker.id);
                });
                
                selectedList.appendChild(item);
            });
        }
    }
    
    if (addToCartBtn) {
        if (selectedStickers.length === MAX_PACK_SIZE) {
            addToCartBtn.disabled = false;
            var priceDisplay = 'Add to Cart — $' + PACK_PRICE.toFixed(2);
            addToCartBtn.textContent = priceDisplay;
        } else if (selectedStickers.length === 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Select Your Stickers';
        } else {
            const remaining = MAX_PACK_SIZE - selectedStickers.length;
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Pick ' + remaining + ' More Sticker' + (remaining !== 1 ? 's' : '');
        }
    }
    
}

function showPackFullWarning() {
    const existing = document.querySelector('.pack-full-warning');
    if (existing) return;
    
    const warning = document.createElement('div');
    warning.className = 'pack-full-warning';
    warning.textContent = '⚠️ Your pack is full! You can only pick 12 stickers. Remove one from the sidebar to add another.';
    warning.style.cssText = [
        'background: rgba(217, 4, 41, 0.15)',
        'border: 1px solid var(--color-red-primary)',
        'color: var(--color-red-primary)',
        'padding: 12px 20px',
        'border-radius: 4px',
        'margin-bottom: 16px',
        'font-family: var(--font-body)',
        'font-size: 0.9rem',
        'text-align: center'
    ].join(';');
    
    const builderLayout = document.querySelector('.builder-layout');
    if (builderLayout) {
        builderLayout.parentNode.insertBefore(warning, builderLayout);
    }
    
    setTimeout(function() {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            warning.remove();
        }, 300);
    }, 3000);
}
