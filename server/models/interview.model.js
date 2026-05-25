import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['HR', 'DSA', 'MERN', 'RESUME']
    },
    score: {
        type: Number
    },
    communicationScore: {
        type: Number
    },
    technicalScore: {
        type: Number
    },
    confidenceScore: {
        type: Number
    },
    feedback: {
        type: String
    },
    questions: [{
        question: String,
        answer: String,
        rating: Number,
        feedback: String
    }]

},{ timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;