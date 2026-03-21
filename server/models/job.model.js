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
    salary:{
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default:'Not mentioned'
    }
},{ timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;