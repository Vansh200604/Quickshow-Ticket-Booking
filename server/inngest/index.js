import { Inngest } from "inngest";
import User from "../models/Users.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url
        };
        await User.create(userData);
    }
)

//Inngest function to delete user from the database when they are deleted from Clerk
const syncUserDeletion  = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data;
        await User.findByIdAndDelete(id);
    }
)

// Inngest function to update user data in the database when they are updated in Clerk
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
         const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url
        };
        await User.findByIdAndUpdate(id, userData);
    }
)

// Ingest function to cancel booking and release seats of show after 10 minutes of booking creation
//  if payment is not done
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id: 'release-seats-and-delete-booking'},
    {event: 'app/checkpayment'},
    async({event, step}) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait for ten minutes', tenMinutesLater);
        await step.run('check-payment-status', async() => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            //if booking payment is not done, release the seats and delete the booking
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats');
                await show.save();
                await show.save();
                await Booking.findByIdAndDelete(bookingId);
                console.log(`Booking ${bookingId} cancelled and seats released due to non-payment.`);
            }
        })
    }
)

// Create an empty array where we'll export future Inngest functionsd
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking
];