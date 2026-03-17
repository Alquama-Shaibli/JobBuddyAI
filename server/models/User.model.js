import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, 'password is required'],

    },
    isAdmin:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = new mongoose.model('User', userSchema);

export default User;