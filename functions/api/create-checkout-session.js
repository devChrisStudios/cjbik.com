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

            const lineItem = {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: descParts.join(' | '),
                    },
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
                cart_json: JSON.stringify(items),
            },
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
