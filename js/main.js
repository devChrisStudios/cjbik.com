/* ============================================================
   BIKFAM STICKER SHOP - Main JavaScript
   ============================================================
   Handles mobile menu, cart management (localStorage), cart
   badge, and page-specific initialization.
   
   Cart is an array of objects stored in localStorage key
   'bikfam-cart'. Each item: { id, name, price, quantity, image,
   type } where type is 'premade', 'custom', or 'decal'.
   ============================================================ */



// ============================================================
// WAIT FOR THE PAGE TO LOAD FIRST
// ============================================================
// This is an "event listener" - it waits until the HTML document
// is fully loaded before running our code. This prevents errors
// from trying to access elements that don't exist yet.

document.addEventListener('DOMContentLoaded', function() {

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
        
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
            });
        });
    }

    updateCartBadge();

    const page = document.body.dataset.page;
    
    if (page === 'shop' || page === 'home') {
        initShopPage();
    } else if (page === 'builder') {
    } else if (page === 'cart') {
        initCartPage();
    }

});



// ============================================================
// CART FUNCTIONS
// ============================================================
// These functions manage the shopping cart using localStorage.
// They're defined outside the DOMContentLoaded block so they
// can be used by other scripts (like build.js) too.



/**
 * Get the current cart from localStorage.
 * @returns {Array} The cart array of items
 */
function getCart() {
    const stored = localStorage.getItem('bikfam-cart');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save the cart to localStorage.
 * @param {Array} cart - The cart array to save
 */
function saveCart(cart) {
    localStorage.setItem('bikfam-cart', JSON.stringify(cart));
    updateCartBadge();
}

/**
 * Add an item to the cart.
 * If the item already exists (same id), increase its quantity instead.
 * @param {Object} item - The item to add { id, name, price, image, type }
 */
function addToCart(item) {
    const cart = getCart();
    
    const existing = cart.find(function(cartItem) {
        return cartItem.id === item.id;
    });
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    
    saveCart(cart);
    
    showAddedFeedback(item.name);
}

/**
 * Remove an item from the cart by its ID.
 * @param {string} itemId - The ID of the item to remove
 */
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(function(item) {
        return item.id !== itemId;
    });
    saveCart(cart);
}

/**
 * Update the quantity of an item in the cart.
 * @param {string} itemId - The item's ID
 * @param {number} newQty - The new quantity (must be at least 1)
 */
function updateQuantity(itemId, newQty) {
    const cart = getCart();
    
    const item = cart.find(function(i) {
        return i.id === itemId;
    });
    
    if (item) {
        if (newQty <= 0) {
            removeFromCart(itemId);
            return;
        }
        item.quantity = newQty;
        saveCart(cart);
    }
}


/**
 * Calculate the total price of everything in the cart.
 * 
 * @returns {number} The total price
 */
function getCartTotal() {
    const cart = getCart();
    let total = 0;
    
    cart.forEach(function(item) {
        var price = parseFloat(item.price) || 0;
        total += price * (item.quantity || 1);
    });
    
    return total;
}


/**
 * Get the total number of items in the cart (sum of quantities).
 * 
 * @returns {number} Total item count
 */
function getCartCount() {
    const cart = getCart();
    let count = 0;
    
    cart.forEach(function(item) {
        count += item.quantity || 1;
    });
    
    return count;
}


function clearCart() {
    localStorage.removeItem('bikfam-cart');
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}


function showAddedFeedback(itemName) {
    const existing = document.querySelector('.cart-feedback');
    if (existing) {
        existing.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = '✓ ' + itemName + ' added to cart!';
    
    feedback.style.cssText = [
        'position: fixed',
        'bottom: 30px',
        'right: 30px',
        'background: var(--color-red-primary, #d90429)',
        'color: white',
        'padding: 15px 25px',
        'border-radius: 4px',
        'font-family: var(--font-heading, Bangers)',
        'font-size: 1.1rem',
        'z-index: 9999',
        'text-transform: uppercase',
        'box-shadow: 0 4px 20px rgba(217, 4, 41, 0.4)',
        'animation: fadeIn 0.3s ease',
        'transition: opacity 0.5s ease'
    ].join(';');
    
    document.body.appendChild(feedback);
    
    setTimeout(function() {
        feedback.style.opacity = '0';
        setTimeout(function() {
            feedback.remove();
        }, 500);
    }, 2500);
}



// ============================================================
// SHOP PAGE (initShopPage)
// ============================================================
// Handles the "Add to Cart" buttons on the shop page where
// users can buy pre-made White or Black 12-Packs.

function initShopPage() {
    
    const addButtons = document.querySelectorAll('.btn-add-cart');
    
    document.querySelectorAll('.custom-file-input').forEach(function(input) {
        const card = input.closest('.card');
        const statusEl = card.querySelector('.custom-url-status');
        const previewEl = card.querySelector('.custom-file-preview');
        const addBtn = card.querySelector('.btn-add-cart');
        
        input.addEventListener('change', function() {
            const file = input.files[0];
            if (!file) return;
            
            // Show local preview before uploading
            const reader = new FileReader();
            reader.onload = function(e) {
                previewEl.src = e.target.result;
                previewEl.style.display = 'block';
            };
            reader.readAsDataURL(file);
            
            // Upload to server
            addBtn.dataset.uploading = 'true';
            addBtn.dataset.imageId = '';
            statusEl.textContent = 'Uploading...';
            statusEl.className = 'custom-url-status';
            
            const formData = new FormData();
            formData.append('image', file);
            
            fetch('/api/upload', { method: 'POST', body: formData })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.error) {
                        statusEl.textContent = data.error;
                        statusEl.className = 'custom-url-status error';
                    } else {
                        statusEl.textContent = 'Image uploaded!';
                        statusEl.className = 'custom-url-status success';
                        addBtn.dataset.imageId = data.imageId;
                    }
                })
                .catch(function() {
                    statusEl.textContent = 'Upload failed. Try again.';
                    statusEl.className = 'custom-url-status error';
                })
                .finally(function() {
                    addBtn.dataset.uploading = 'false';
                });
        });
    });
    
    addButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price) || 0;
            const image = button.dataset.image || '📦';
            
            const item = {
                id: id,
                name: name,
                price: price,
                image: image,
                type: 'premade'
            };
            
            if (button.dataset.custom === 'true') {
                const statusEl = button.closest('.card').querySelector('.custom-url-status');
                const imageId = button.dataset.imageId;
                const uploading = button.dataset.uploading === 'true';
                
                if (uploading) {
                    statusEl.textContent = 'Please wait, image is still uploading...';
                    statusEl.className = 'custom-url-status error';
                    return;
                }
                
                if (!imageId) {
                    statusEl.textContent = 'Please upload your design image first.';
                    statusEl.className = 'custom-url-status error';
                    return;
                }
                
                item.type = 'custom';
                item.id = 'custom-decal-' + Date.now();
                item.imageId = imageId;
            }
            
            addToCart(item);
        });
    });
    
    document.querySelectorAll('.color-selector').forEach(function(selector) {
        const options = selector.querySelectorAll('.color-option');
        const targetBase = selector.dataset.target;
        options.forEach(function(option) {
            option.addEventListener('click', function() {
                options.forEach(function(o) { o.classList.remove('selected'); });
                option.classList.add('selected');
                const card = selector.closest('.card');
                const img = card.querySelector('.card-image img');
                if (img && targetBase) {
                    const prefix = targetBase === 'odi-standard' ? 'ODI' : 'Motocutz';
                    img.src = 'images/' + prefix + '_' + option.dataset.color + '.png';
                }
            });
        });
    });
    
    document.querySelectorAll('.btn-add-decal').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = button.closest('.card');
            const selectedColor = card.querySelector('.color-option.selected');
            const color = selectedColor ? selectedColor.dataset.color : 'White';
            const handleInput = card.querySelector('.decal-handle');
            const handle = handleInput ? handleInput.value.trim() || '@cjbik' : '@cjbik';
            const baseId = button.dataset.baseId;
            
            const item = {
                id: baseId + '-' + color.toLowerCase(),
                name: button.dataset.name + ' (' + color + ')',
                price: parseFloat(button.dataset.price) || 0,
                image: button.dataset.image || '📦',
                type: 'decal',
                color: color,
                handle: handle
            };
            
            addToCart(item);
        });
    });
    
}



// ============================================================
// CART PAGE (initCartPage)
// ============================================================
// Renders the cart items on the cart page and handles
// quantity changes, removal, and checkout.

function initCartPage() {
    
    const cartContainer = document.querySelector('.cart-items-container');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');
    const cartHasItems = document.querySelector('.cart-has-items');
    const cartSuccess = document.querySelector('.cart-success');
    const cartCancelled = document.querySelector('.cart-cancelled');
    const cartLayout = document.querySelector('.cart-layout');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartContainer) return;
    
    var params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
        if (cartSuccess) cartSuccess.style.display = 'block';
        if (cartLayout) cartLayout.style.display = 'none';
        clearCart();
        return;
    }
    if (params.get('cancelled')) {
        if (cartCancelled) cartCancelled.style.display = 'block';
        if (cartLayout) cartLayout.style.display = 'none';
        return;
    }
    
    const cart = getCart();
    
    // Show empty state or items
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartHasItems.style.display = 'none';
        cartSummary.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    // We have items - show them
    cartEmpty.style.display = 'none';
    cartHasItems.style.display = 'block';
    cartSummary.style.display = 'block';
    
    // --- Clear Cart button ---
    var clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        // Remove any old listener to avoid duplicates if re-initialized
        var newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        newClearBtn.addEventListener('click', function() {
            if (confirm('Clear your entire cart?')) {
                clearCart();
                cartContainer.innerHTML = '';
                cartEmpty.style.display = 'block';
                cartHasItems.style.display = 'none';
                cartSummary.style.display = 'none';
                updateCartSummary();
            }
        });
    }
    
    // Clear existing items and re-render
    cartContainer.innerHTML = '';
    
    cart.forEach(function(item) {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.dataset.id = item.id;
        
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        
        var extraDetail = '';
        if (item.type === 'custom' && item.stickers && item.stickers.length > 0) {
            extraDetail = '<div class="item-detail" style="font-size: 0.75rem; margin-top: 4px; color: #666;">' +
                          item.stickers.join(', ') +
                          '</div>';
        }
        if (item.type === 'custom' && item.imageId) {
            extraDetail = '<div class="item-detail" style="font-size: 0.75rem; margin-top: 4px; color: #666;">' +
                          'Custom design uploaded' +
                          '</div>';
        }
        if (item.type === 'decal' && item.handle) {
            extraDetail = '<div class="item-detail" style="font-size: 0.75rem; margin-top: 4px; color: #666;">' +
                          'Handle: ' + item.handle +
                          '</div>';
        }
        
        var imgSrc = item.image || '📦';
        var isEmoji = imgSrc.length <= 2;
        itemEl.innerHTML = [
            '<div class="cart-item-image">' + (isEmoji ? '<span style="font-size:2rem;">' + imgSrc + '</span>' : '<img src="' + imgSrc + '" alt="' + item.name + '">') + '</div>',
            '<div class="cart-item-info">',
            '  <h4>' + item.name + '</h4>',
            '  <div class="item-detail">' + formatPrice(item.price) + ' each</div>',
            extraDetail,
            '</div>',
            '<div class="cart-item-quantity">',
            '  <button class="qty-btn qty-minus">−</button>',
            '  <span class="qty-display">' + item.quantity + '</span>',
            '  <button class="qty-btn qty-plus">+</button>',
            '</div>',
            '<div class="cart-item-total">' + formatPrice(itemTotal) + '</div>',
            '<button class="cart-item-remove">✕ Remove</button>'
        ].join('');
        
        cartContainer.appendChild(itemEl);
        
        // --- Quantity buttons ---
        const minusBtn = itemEl.querySelector('.qty-minus');
        const plusBtn = itemEl.querySelector('.qty-plus');
        const qtyDisplay = itemEl.querySelector('.qty-display');
        
        minusBtn.addEventListener('click', function() {
            const current = item.quantity || 1;
            if (current <= 1) {
                // At minimum - remove the item instead
                removeFromCart(item.id);
                itemEl.remove();
                // Check if cart is now empty
                if (getCart().length === 0) {
                    cartEmpty.style.display = 'block';
                    cartHasItems.style.display = 'none';
                    cartSummary.style.display = 'none';
                }
                updateCartSummary();
                return;
            }
            updateQuantity(item.id, current - 1);
            item.quantity = current - 1;
            qtyDisplay.textContent = item.quantity;
            updateCartSummary();
        });
        
        plusBtn.addEventListener('click', function() {
            const current = item.quantity || 1;
            updateQuantity(item.id, current + 1);
            item.quantity = current + 1;
            qtyDisplay.textContent = item.quantity;
            updateCartSummary();
        });
        
        // --- Remove button ---
        const removeBtn = itemEl.querySelector('.cart-item-remove');
        removeBtn.addEventListener('click', function() {
            removeFromCart(item.id);
            itemEl.remove();
            if (getCart().length === 0) {
                cartEmpty.style.display = 'block';
                cartHasItems.style.display = 'none';
                cartSummary.style.display = 'none';
            }
            updateCartSummary();
        });
    });
    
    // Update the summary with totals
    updateCartSummary();
    
    // Enable and wire checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.addEventListener('click', function() {
            checkout();
        });
    }
    
}


function checkout() {
    var cart = getCart();
    if (cart.length === 0) return;

    var checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Redirecting to Stripe...';
    }

    fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
    })
    .then(function(res) {
        if (!res.ok) {
            return res.text().then(function(text) {
                throw new Error('Server error: ' + text);
            });
        }
        return res.json();
    })
    .then(function(data) {
        if (data.url) {
            window.location.href = data.url;
        } else {
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Proceed to Checkout';
            }
            alert(data.error || 'Something went wrong. Please try again.');
        }
    })
    .catch(function(err) {
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
        alert('Checkout error: ' + err.message);
    });
}

function updateCartSummary() {
    const subtotalEl = document.querySelector('.summary-subtotal .amount');
    const totalEl = document.querySelector('.total .amount');
    
    if (!subtotalEl) return;
    
    const total = getCartTotal();
    const formattedTotal = formatPrice(total);
    
    subtotalEl.textContent = formattedTotal;
    if (totalEl) {
        totalEl.textContent = formattedTotal;
    }
}


function formatPrice(price) {
    return '$' + (parseFloat(price) || 0).toFixed(2);
}
