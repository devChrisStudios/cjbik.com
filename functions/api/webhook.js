import Stripe from 'stripe';

export async function onRequest(context) {
    try {
        const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);

        const body = await context.request.text();
        const signature = context.request.headers.get('stripe-signature');

        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, context.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return new Response('Invalid signature: ' + err.message, { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const items = JSON.parse(session.metadata.cart_json || '[]');

            const customer = session.customer_details || {};
            const shipping = session.shipping_details || {};
            const address = shipping.address || {};

            const orderKey = 'orders/' + session.id + '.json';
            const orderData = JSON.stringify({
                sessionId: session.id,
                customerEmail: customer.email || null,
                customerName: customer.name || null,
                customerPhone: customer.phone || null,
                shippingName: shipping.name || null,
                shippingAddress: {
                    line1: address.line1 || null,
                    line2: address.line2 || null,
                    city: address.city || null,
                    state: address.state || null,
                    postalCode: address.postal_code || null,
                    country: address.country || null,
                },
                paid: true,
                amountTotal: session.amount_total,
                createdAt: new Date().toISOString(),
                items: items,
            });

            await context.env.DECAL_UPLOADS.put(orderKey, orderData);
        }

        return new Response(JSON.stringify({ received: true }));
    } catch (err) {
        return new Response('Server error: ' + err.message, { status: 500 });
    }
}
