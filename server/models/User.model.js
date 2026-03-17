import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, 'password is required'],

    },
    skills: {
        type: [String],
        default: [],
        index: true
    },
    experience:{
        type: Number,
        default: 0
    },
    preferredRole:{
        type: String,
        default: ''
    },
    location:{
        type: String,
        default: ''
    },
    resume:{
        type: String,
        default: ''
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = new mongoose.model('User', userSchema);

export default User;