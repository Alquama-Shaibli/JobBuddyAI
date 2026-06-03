import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import dummyJobs from "../data/dummyJobs.js";
import { jobCreateSchema } from "../validators/auth.validators.js";

export const createJob = async (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: 'Only admins can post jobs' });
    }

    const parsed = jobCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    try {
        const job = await Job.create({ ...parsed.data, postedBy: req.user.id });
        res.status(201).json({ success: true, message: 'Job created successfully', job });
    } catch (error) {
        next(error);
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const { keyword, location, skills, experience, salary } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const skip = (page - 1) * limit;

        const query = {};

        if (keyword) {
            const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: { $regex: safeKeyword, $options: 'i' } },
                { description: { $regex: safeKeyword, $options: 'i' } },
                { company: { $regex: safeKeyword, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
            query.skillsRequired = { $in: skillsArray.map(skill => new RegExp(`^${skill}$`, 'i')) };
        }

        if (experience !== undefined && !isNaN(Number(experience))) {
            query.experienceRequired = { $lte: Number(experience) };
        }

        if (salary !== undefined && !isNaN(Number(salary))) {
            query.salary = { $gte: Number(salary) };
        }

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate('postedBy', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Job.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            jobCount: total,
            jobs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};

export const skillMatching = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('skills').lean();
        const jobs = await Job.find().lean();

        const userSkills = (user?.skills || []).map(s => s.toLowerCase());

        const matchedJobs = jobs.map(job => {
            const requiredSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
            const matchCount = requiredSkills.filter(s => userSkills.includes(s)).length;
            const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
            const matchPercentage = requiredSkills.length
                ? Math.round((matchCount / requiredSkills.length) * 100)
                : 0;
            return { ...job, matchPercentage, missingSkills };
        });

        matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
        res.status(200).json({ success: true, jobs: matchedJobs });
    } catch (error) {
        next(error);
    }
};

export const getJobRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('_id').lean();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const jobs = [...dummyJobs].sort((a, b) => b.matchPercentage - a.matchPercentage);
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        next(error);
    }
};