import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
        trim:true,
    },
    isVerified: {
        type:Boolean,
        default:false,
    },

    // If required : then use this Model
    roles: {
        type: [String],
        enum: ["user","admin"],
        default: ["user"],
    }

    


});

const UserModel = mongoose.model("user",UserSchema);
export default UserModel;