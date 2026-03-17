import { request, response } from 'express';
import stripe from 'stripe';
import Booking from '../models/Booking.js';

export const stripeWebhooks = async(req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];

    let event;
    try{
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch(error){
        console.error("Error is in processing stripe webhook:", error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    try{
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })
                const session = sessionList.data[0];
                const {bookingId} = session.metadata;

                // Here you can update your booking in database as paid using the bookingId
                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })
                break;
            }
                
                
        
            default:
                console.log(`Unhandled event type ${event.type}`);
        } 
        response.json({ received: true });
    }
    catch(error){
        console.error("webhook processing error:", error);
        response.status(500).send("Internal Server Error webhooks");
    }
}