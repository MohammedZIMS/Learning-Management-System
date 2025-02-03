import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongodb_URL);
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB not Connected', error);    
    }
}

export default connectDB;