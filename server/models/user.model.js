import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    profilePicture: {
        type: String,
        default: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png'
    },
    skills: {
        type: [String],
        default: [],
    },
    education: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    experience: {
        type: Number,
        default: 0
    },
    preferredRole: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    resume: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    languages: {
        type: [String],
        default: []
    },
    resumeUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ skills: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isAdmin: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
