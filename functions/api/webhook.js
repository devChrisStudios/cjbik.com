import Stripe from 'stripe';

export async function onRequest(context) {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);

    const body = await context.request.text();
    const signature = context.request.headers.get('stripe-signature');

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, context.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return new Response('Invalid signature', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const items = JSON.parse(session.metadata.cart_json || '[]');

        const orderKey = 'orders/' + session.id + '.json';
        const orderData = JSON.stringify({
            sessionId: session.id,
            customerEmail: session.customer_details ? session.customer_details.email : null,
            customerName: session.customer_details ? session.customer_details.name : null,
            paid: true,
            amountTotal: session.amount_total,
            createdAt: new Date().toISOString(),
            items: items,
        });

        await context.env.DECAL_UPLOADS.put(orderKey, orderData);
    }

    return new Response(JSON.stringify({ received: true }));
}
