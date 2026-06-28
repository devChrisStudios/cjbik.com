import Stripe from 'stripe';

export async function onRequest(context) {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);
    const { items } = await context.request.json();
    const origin = new URL(context.request.url).origin;

    const lineItems = items.map(function(item) {
        const lineItem = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round((item.price || 0) * 100),
            },
            quantity: item.quantity || 1,
        };

        if (item.type === 'custom' && item.stickers && item.stickers.length > 0) {
            lineItem.price_data.product_data.description =
                'Stickers: ' + item.stickers.join(', ');
        }

        return lineItem;
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: origin + '/cart?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: origin + '/cart?cancelled=1',
        metadata: {
            cart_json: JSON.stringify(items),
        },
    });

    return new Response(JSON.stringify({ url: session.url }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
