import mongoose from "mongoose";
const connectDB = async(DATABASE_URL)=>{
    try {
        const DB_OPTIONS = {
            dbName: "NextJs-AUTH"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS);
        console.log("Database Connected !!");

    } catch (error) {
        console.log("Database ERROR: ",error);
    }
};

export default connectDB;