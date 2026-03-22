import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    company:{
        type: String,
        required: true,
        trim: true
    },
    location:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    skillsRequired:{
        type: [String],
        default: []
    },
    experienceRequired:{
        type: Number,
        default: 0
    },
    experienceLevel:{
        type: String,
        enum: ['fresher', 'junior', 'mid', 'senior'],
        default: 'fresher'
    },
    salary:{
        type: String,
        required: true,
        default:'Not mentioned'
    },
    jobType:{
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'],
        default: 'full-time'
    },
    postedBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
},{ timestamps: true });

// indexing helpful for future search
// jobSchema.index({ title: "text", description: "text", company: "text" });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema); //check if job model already exist then use that else make new model

export default Job;