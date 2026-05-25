import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String
    },
    extractedText: {
        type: String,
        required: true
    },
    skills: {
        type: [String]
    },
    education: {
        type: [String]
    },
    experience: {
        type: [String]
    }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;