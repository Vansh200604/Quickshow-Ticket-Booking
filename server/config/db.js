import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected Successfully!'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`)
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
export default connectDB;