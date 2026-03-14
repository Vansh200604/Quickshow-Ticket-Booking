import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try{
        
        const { userId } = req.auth();

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const user = await clerkClient.users.getUser(userId);

        if(user.privateMetadata?.role !== 'admin'){
            return res.status(403).json({success: false, message: "Access denied. Admin privileges required."});
        }
        next();
    }
    catch(error){
        console.error("Error in protectAdmin middleware:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}