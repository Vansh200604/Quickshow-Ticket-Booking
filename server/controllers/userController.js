import Booking from '../models/Booking.js';
import {clerkClient} from '@clerk/express';
import Movie from '../models/Movie.js';

// Api to get user bookings
export const getUserBookings = async(req, res) => {
    try{
        const user = req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({createdAt: -1});
        res.json({success: true, bookings});
    }
    catch(error){
        console.error("Error fetching user bookings userController:", error);
        res.status(500).json({success: false, message: "Error fetching user bookings from the userController"})
    }
}

// Api to update favorite movie in Clerk user metadata
export const updateFavorite = async(req, res) => {
    try{
        const {movieId} = req.body;
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = [];
        }
        if(user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId);
        }
        else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(id => id !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata});
        res.json({success: true, message: "Movie added to favorites successfully"})
    }
    catch(error){
        console.error("Error updating favorite movie in userController:", error);
        res.status(500).json({success: false, message: "Error updating favorite movie in userController"})
    }
}

// Api to get favorite movies of user
export const getFavorites = async(req, res) => {
    try{
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites;

        // Getting movies from favorite 
        const movies = await Movie.find({_id: {$in: favorites}});
        res.json({success: true, movies});
    }
    catch(error){
        console.error("Error fetching favorite movies in userController:", error);
        res.status(500).json({success: false, message: "Error fetching favorite movies in userController"})
    }
}