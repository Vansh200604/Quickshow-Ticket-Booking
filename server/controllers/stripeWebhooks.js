import Stripe from 'stripe';
import Booking from '../models/Booking.js';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async(req, res) => {
    // Initialize Stripe WITHOUT 'new' keyword
    
    const sig = req.headers['stripe-signature'];

    let event;
    try{
        // req.body should be a Buffer when using express.raw()
        
        event = stripeInstance.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }
    catch(error){
        console.error("Stripe webhook error:", error.message);
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
                    paymentLink: "",
                }, {new: true});

                // Send Confirmation Email to user
                await inngest.send({
                    name: 'app/show.booked',
                    data: {bookingId}
                })
                
                console.log(`✅ Booking ${bookingId} marked as paid`);
                break;
            }
                
            default:
                console.log(`Unhandled event type ${event.type}`);
        } 
        res.json({ received: true });
    }
    catch(error){
        console.error("Webhook processing error:", error.message);
        res.status(500).send("Internal Server Error webhooks");
    }
}