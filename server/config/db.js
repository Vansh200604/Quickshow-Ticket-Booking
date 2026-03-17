// import mongoose from 'mongoose';

// const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected', () => console.log('Database Connected Successfully!'));
//         await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`)
//     } catch (error) {
//         console.log(error.message);
//         process.exit(1);
//     }
// }
// export default connectDB;



import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  try {

    if (isConnected) {
      return;
    }

    const db = await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);

    isConnected = db.connections[0].readyState;

    console.log("Database Connected Successfully!");

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);
    throw error;

  }
};

export default connectDB;