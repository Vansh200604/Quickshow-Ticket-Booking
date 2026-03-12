import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

export const checkSeatsAvailability = async(showId, selectedSeats) => {
    try{
        const showData = await Show.findById(showId);
        if(!showData){
            return false;
        }
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    }
    catch(error){
        console.error("Error is in checking seat availability:", error);
        return false;
    }
}

export const createBooking = async(req, res) => {
    try{
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;

        //check if the seats are available for selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if(!isAvailable){
            return res.json({success: false, message: "Selected seats are not available."})
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new booking 
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats  
        })

        // Update the occupied seats for the show
        selectedSeats.map((seats) => {
            showData.occupiedSeats[seats] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe Gateway Initialize 
        res.json({success: true, message: "Booked successfully", bookingId: booking._id})

    }
    catch(error){
        console.error("Error is in creating booking:", error);
        res.status(500).json({success: false, message: "Error is in creating booking"})
    }
}

// get Occupied Seats
export const getOccupiedSeats = async(req, res) => {
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({success: true, occupiedSeats});
    }
 
    catch(error){
        console.error("Error is in fetching occupied seats:", error);
        res.status(500).json({success: false, message: "Error is in fetching occupied seats"})
    }
}