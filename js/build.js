/* ============================================================
   BIKFAM STICKER SHOP - Custom 12-Pack Builder
   ============================================================
   This file handles the "Build Your Own 12-Pack" page.
   Users click on sticker designs to add them to their pack.
   They need to pick exactly 12 to add to cart.
   
   HOW IT WORKS:
   1. We define all available sticker designs below
   2. Each sticker is displayed as a clickable card
   3. Clicking toggles selection (adds/removes from pack)
   4. A sidebar shows progress (X/12 selected) and the list
   5. Once 12 are selected, the "Add to Cart" button lights up
   6. Clicking "Add to Cart" creates a custom pack item
   ============================================================ */



// ============================================================
// STICKER CATALOG
// ============================================================
// This is where you define ALL the stickers available in the
// custom pack builder. Just add/remove objects from the list.
//
// HOW TO ADD A STICKER:
//   Copy one of the blocks below, paste it inside the array,
//   and fill in your own values:
//
//   {
//       id: 'my-sticker',          // unique name, no spaces
//       name: 'My Sticker',        // what customers see
//       color: 'White',            // 'White' or 'Black'
//       image: '📷',               // replace with image path later
//       category: 'my-category'    // for grouping
//   }
//
// HOW TO REMOVE A STICKER:
//   Just delete the block (from { to }) for that sticker.
//
// HOW TO ADD IMAGES LATER:
//   Change 'image' from '📷' to the actual path, like:
//   image: 'images/my-sticker.png'
//
// TIP: Each sticker design can have two variants — White and Black.
// If a design only comes in one color, just delete the other entry.

const STICKERS = [
    // ── Each block is one sticker. Colors (White/Black) are filled in.
    // ── Replace NAME with your design name, IMAGE with the file path later.
    //
    //   {
    //       id: 'design-01-white',   // unique id — keep it lowercase, no spaces
    //       name: 'DESIGN 01',       // customer-facing name — replace this
    //       color: 'White',          // 'White' or 'Black'
    //       image: '📷',             // replace with 'images/my-design.png'
    //       category: 'brand'        // just for grouping, pick any name
    //   }
    //
    // TIP: Each design can come in both White and Black. Just duplicate
    // the block and change the color. If one color doesn't exist, delete that block.

    {
        id: 'design-01-white',
        name: 'DESIGN 01',
        color: 'White',
        image: '📷',
        category: 'brand'
    },
    {
        id: 'design-01-black',
        name: 'DESIGN 01',
        color: 'Black',
        image: '📷',
        category: 'brand'
    },
    {
        id: 'design-02-white',
        name: 'DESIGN 02',
        color: 'White',
        image: '📷',
        category: 'brand'
    },
    {
        id: 'design-02-black',
        name: 'DESIGN 02',
        color: 'Black',
        image: '📷',
        category: 'brand'
    },
    {
        id: 'design-03-white',
        name: 'DESIGN 03',
        color: 'White',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-03-black',
        name: 'DESIGN 03',
        color: 'Black',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-04-white',
        name: 'DESIGN 04',
        color: 'White',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-04-black',
        name: 'DESIGN 04',
        color: 'Black',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-05-white',
        name: 'DESIGN 05',
        color: 'White',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-05-black',
        name: 'DESIGN 05',
        color: 'Black',
        image: '📷',
        category: 'riding'
    },
    {
        id: 'design-06-white',
        name: 'DESIGN 06',
        color: 'White',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-06-black',
        name: 'DESIGN 06',
        color: 'Black',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-07-white',
        name: 'DESIGN 07',
        color: 'White',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-07-black',
        name: 'DESIGN 07',
        color: 'Black',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-08-white',
        name: 'DESIGN 08',
        color: 'White',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-08-black',
        name: 'DESIGN 08',
        color: 'Black',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-09-white',
        name: 'DESIGN 09',
        color: 'White',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-09-black',
        name: 'DESIGN 09',
        color: 'Black',
        image: '📷',
        category: 'attitude'
    },
    {
        id: 'design-10-white',
        name: 'DESIGN 10',
        color: 'White',
        image: '📷',
        category: 'extra'
    },
    {
        id: 'design-10-black',
        name: 'DESIGN 10',
        color: 'Black',
        image: '📷',
        category: 'extra'
    },
    {
        id: 'design-11-white',
        name: 'DESIGN 11',
        color: 'White',
        image: '📷',
        category: 'extra'
    },
    {
        id: 'design-11-black',
        name: 'DESIGN 11',
        color: 'Black',
        image: '📷',
        category: 'extra'
    },
    {
        id: 'design-12-white',
        name: 'DESIGN 12',
        color: 'White',
        image: '📷',
        category: 'extra'
    },
    {
        id: 'design-12-black',
        name: 'DESIGN 12',
        color: 'Black',
        image: '📷',
        category: 'extra'
    }
];

// Maximum number of stickers allowed in a custom pack
const MAX_PACK_SIZE = 12;

// Price for a custom 12-pack — change 0 to your actual price
const PACK_PRICE = 11.99;



// ============================================================
// BUILDER STATE
// ============================================================
// This tracks what the user has selected during their session.
// It's a simple array of sticker IDs that grows/shrinks as
// they click on stickers.

let selectedStickers = [];



// ============================================================
// INITIALIZE THE BUILDER
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Only run on the builder page
    const page = document.body.dataset.page;
    if (page !== 'builder') return;
    
    // Get the container where stickers will be displayed
    const grid = document.querySelector('.sticker-grid');
    const sidebar = document.querySelector('.builder-sidebar');
    
    if (!grid) return; // Safety check - stop if no grid found
    
    // --- STEP 1: Render all sticker options ---
    STICKERS.forEach(function(sticker) {
        const option = document.createElement('div');
        option.className = 'sticker-option';
        option.dataset.id = sticker.id;
        
        option.innerHTML = [
            '<div class="sticker-preview" style="background: ' + (sticker.color === 'White' ? '#1a1a1a' : '#e0e0e0') + '">',
            '  <span class="img-placeholder">' + sticker.image + '</span>',
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
    
    // --- STEP 2: Add "Add to Cart" button handler ---
    const addToCartBtn = document.querySelector('.btn-add-custom-pack');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Make sure exactly 12 are selected (should always be true if button is enabled)
            if (selectedStickers.length !== MAX_PACK_SIZE) return;
            
            // Build a list of sticker names and colors for the cart display
            const stickerList = selectedStickers.map(function(id) {
                const s = STICKERS.find(function(stk) { return stk.id === id; });
                return s ? s.name + ' (' + s.color + ')' : id;
            });
            
            // Create a unique ID for this custom pack (timestamp-based so each is unique)
            const packId = 'custom-pack-' + Date.now();
            
            // Build the item for the cart
            const item = {
                id: packId,
                name: 'Custom 12-Pack',
                price: PACK_PRICE,
                image: '🎨',
                type: 'custom',
                stickers: stickerList,       // Save the list of chosen stickers
                stickerIds: selectedStickers  // Save the raw IDs too
            };
            
            // Add to cart (this function is in main.js)
            addToCart(item);
            
            // Reset the builder for a fresh start
            selectedStickers = [];
            updateBuilderUI();
        });
    }
    
    // --- STEP 3: Initial UI update ---
    updateBuilderUI();
    
});



// ============================================================
// BUILDER LOGIC
// ============================================================


/**
 * Add a sticker to the pack (up to MAX_PACK_SIZE).
 * Unlike the old toggle behavior, clicking always adds one.
 * Remove stickers using the sidebar's remove buttons.
 * 
 * @param {string} stickerId - The ID of the sticker to add
 */
function addSticker(stickerId) {
    if (selectedStickers.length >= MAX_PACK_SIZE) {
        showPackFullWarning();
        return;
    }
    selectedStickers.push(stickerId);
    updateBuilderUI();
}

/**
 * Remove one occurrence of a sticker from the pack.
 * Used by sidebar remove buttons.
 * 
 * @param {string} stickerId - The ID of the sticker to remove
 */
function removeSticker(stickerId) {
    const index = selectedStickers.indexOf(stickerId);
    if (index !== -1) {
        selectedStickers.splice(index, 1);
        updateBuilderUI();
    }
}


/**
 * Update the entire builder UI after a selection change.
 * This updates:
 * - The sticker grid (selected/unselected visual state)
 * - The progress bar
 * - The count text
 * - The selected items list in the sidebar
 * - The "Add to Cart" button state
 */
function updateBuilderUI() {
    
    // --- Update sticker grid visuals with count badges ---
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
    
    // --- Update sidebar ---
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
    
    // --- Update selected items list ---
    if (selectedList) {
        selectedList.innerHTML = '';
        
        if (selectedStickers.length === 0) {
            // Show empty state message
            selectedList.innerHTML = '<div class="builder-empty"><div class="empty-icon">🖍️</div><p>Click on stickers above to build your pack!</p></div>';
        } else {
            // List each selected sticker with a remove button
            selectedStickers.forEach(function(stickerId) {
                // Find the sticker info from our catalog
                const sticker = STICKERS.find(function(s) {
                    return s.id === stickerId;
                });
                if (!sticker) return;
                
                const item = document.createElement('div');
                item.className = 'selected-item';
                item.innerHTML = [
                    '<span>' + sticker.image + ' ' + sticker.name + ' (' + sticker.color + ')</span>',
                    '<button class="remove-btn" data-id="' + sticker.id + '">✕</button>'
                ].join('');
                
                // Remove button inside the list
                item.querySelector('.remove-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeSticker(sticker.id);
                });
                
                selectedList.appendChild(item);
            });
        }
    }
    
    // --- Update "Add to Cart" button ---
    if (addToCartBtn) {
        if (selectedStickers.length === MAX_PACK_SIZE) {
            // Exactly 12 selected - ready to add!
            addToCartBtn.disabled = false;
            var priceDisplay = PACK_PRICE > 0 ? 'Add to Cart — $' + PACK_PRICE.toFixed(2) : 'Add to Cart — INSERT PRICE';
            addToCartBtn.textContent = priceDisplay;
        } else if (selectedStickers.length === 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Select Your Stickers';
        } else {
            // Partially filled - show how many more needed
            const remaining = MAX_PACK_SIZE - selectedStickers.length;
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Pick ' + remaining + ' More Sticker' + (remaining !== 1 ? 's' : '');
        }
    }
    
}


/**
 * Show a warning when someone tries to add more than 12 stickers.
 * Gently reminds them the pack is full.
 */
function showPackFullWarning() {
    // Re-use the feedback system from main.js if available,
    // or just create a simple alert-like message
    const existing = document.querySelector('.pack-full-warning');
    if (existing) return; // Don't spam warnings
    
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
    
    // Insert the warning at the top of the builder layout
    const builderLayout = document.querySelector('.builder-layout');
    if (builderLayout) {
        builderLayout.parentNode.insertBefore(warning, builderLayout);
    }
    
    // Auto-remove after 3 seconds
    setTimeout(function() {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            warning.remove();
        }, 300);
    }, 3000);
}
