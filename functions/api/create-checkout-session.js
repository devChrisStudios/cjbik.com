import Stripe from 'stripe';

export async function onRequest(context) {
    try {
        const key = context.env.STRIPE_SECRET_KEY;
        if (!key) {
            return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY is not set in environment variables' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const stripe = new Stripe(key);
        const { items } = await context.request.json();
        const origin = new URL(context.request.url).origin;

        // Save cart items to R2 to avoid Stripe's 500-char metadata limit
        const cartRef = 'cart_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        await context.env.DECAL_UPLOADS.put('cart_session/' + cartRef + '.json', JSON.stringify(items));

        const lineItems = items.map(function(item) {
            var descParts = [];

            if (item.type === 'custom' && item.stickers && item.stickers.length > 0) {
                descParts.push('Stickers: ' + item.stickers.join(', '));
            }
            if (item.color) {
                descParts.push('Color: ' + item.color);
            }
            if (item.handle) {
                descParts.push('Handle: ' + item.handle);
            }
            if (item.imageId) {
                descParts.push('Image: ' + item.imageId);
            }

            var product_data = { name: item.name };
            if (descParts.length > 0) {
                product_data.description = descParts.join(' | ');
            }

            const lineItem = {
                price_data: {
                    currency: 'usd',
                    product_data: product_data,
                    unit_amount: Math.round((item.price || 0) * 100),
                },
                quantity: item.quantity || 1,
            };

            return lineItem;
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: origin + '/cart?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: origin + '/cart?cancelled=1',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            phone_number_collection: {
                enabled: true,
            },
            metadata: {
                cart_ref: cartRef,
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 899, currency: 'usd' },
                        display_name: 'Shipping',
                    },
                },
            ],
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
