import stripe from 'stripe';
import Booking from '../models/Booking.js';

export const stripeWebhooks = async(req, res) => {
    // Initialize Stripe WITHOUT 'new' keyword
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;
    try{
        // req.body should be a Buffer when using express.raw()
        const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        
        event = stripeInstance.webhooks.constructEvent(
            body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }
    catch(error){
        console.error("Error is in processing stripe webhook:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    try{
        switch (event.type) {
            case 'checkout.session.completed':{
                const session = event.data.object;
                const {bookingId} = session.metadata;

                if(!bookingId){
                    console.warn("No bookingId found in metadata");
                    break;
                }

                // Update booking as paid
                const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                }, {new: true});
                
                console.log(`✅ Booking ${bookingId} marked as paid`);
                break;
            }
                
                
        
            default:
                console.log(`Unhandled event type ${event.type}`);
        } 
        res.json({ received: true });
    }
    catch(error){
        console.error("webhook processing error:", error.message);
        res.status(500).send("Internal Server Error webhooks");
    }
}