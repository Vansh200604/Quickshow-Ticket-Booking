import User from '../models/Users.js'
import Booking from '../models/Booking.js'
import Show from '../models/Show.js';
import { clerkClient } from '@clerk/express';

// Api to check user is admin or not
export const isAdmin = async(req, res) => {
    try{
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({success: false, message: "User not authenticated"});
        }
        const user = await clerkClient.users.getUser(userId);
        const userIsAdmin = user.privateMetadata?.role === 'admin';
        res.json({success: true, isAdmin: userIsAdmin});
    }
    catch(error){
        console.error("Error in isAdmin controller:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// Api to get dashboard data
export const getDashboardData = async(req, res) => {
    try{
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');
        const totalUsers = await User.countDocuments();
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.amount, 0);

        const dashboardData = {
            totalBookings: bookings.length,
            activeShows: activeShows,
            totalRevenue,
            totalUsers
        }
        res.json({success: true, dashboardData});
    }
    catch(error){
        res.status(500).json({success: false, message: `Error fetching dashboard data: ${error.message}`});
    }
}

// Api to get all shows
export const getAllShows = async(req, res) => {
    try{
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});
        res.json({success: true, shows});
    }
    catch(error){
        console.error("Error fetching shows from the adminController:", error);
        res.status(500).json({success: false, message: `Error fetching shows adminController: ${error.message}`});
    }
}

// Api to get all bookings
export const getAllBookings = async(req, res) => {
    try{
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({createdAt: -1});
        res.json({success: true, bookings});
    }
    catch(error){
        console.error("Error fetching bookings from the adminController:", error);
        res.status(500).json({success: false, message: `Error fetching bookings adminController: ${error.message}`});
    }
}