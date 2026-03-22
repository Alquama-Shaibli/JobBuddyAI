import Job from "../models/job.model.js";
import User from "../models/user.model.js"

// Admin Job Posting
export const createJob = async (req, res, next)=>{
    const { title, company, location, description, skillsRequired, experienceRequired, experienceLevel, salary } = req.body;

    //validation
    if(!req.user || !req.user.isAdmin){
        return next({ statusCode: 403, message: 'Only admin can post jobs'});
    };

    if(!title || !company || !location || !description){
        return next({ statusCode: 400, message: 'please fill all required field'});
    };

    try {
        const job = await Job.create({
            title,
            company,
            location,
            description,
            skillsRequired,
            experienceRequired,
            experienceLevel,
            salary,
            postedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Job is Successfully Created',
            job
        });
    } catch (error) {
        next(error)
    }
};

//Users find all jobs
export const getAllJobs = async (req, res, next)=>{
    const {keyword, location, skills, experience, salary} = req.query;
    // validation
    if(!req.user){
        return next({statusCode: 401, message: "You are not authorized"})
    };
    console.log(keyword);
    try {
        
        let query = {};

        if(keyword){
            query.$or = [
                {title: { $regex: keyword, $options: 'i' }},
                {description: { $regex: keyword, $options: 'i' }},
                {company: { $regex: keyword, $options: 'i' }}
            ];
        };

        if(location){
            query.location = { $regex: location, $options: 'i' };
        };

        if (skills) {
            const skillsArray = skills.split(",");
            query.skillsRequired = {
                $in: skillsArray.map(skill => new RegExp(skill, "i"))
            };
        }

        if(experience !== undefined){
            query.experienceRequired = { $lte: Number(experience) };
        };

        if (salary) {
            query.salary = { $gte: Number(salary) };
        };

        const jobs = await Job.find(query)
                            .populate("postedBy", "username email",)
                            .sort({ createdAt: -1 });

        console.log(query);

        res.status(200).json({
            success: true,
            jobCount: jobs.length,
            jobs
        });

    } catch (error) {
        next(error)
    }
};

export const skillMatching = async (req, res, next)=>{
    try {
        const user = await User.findById(req.user.id);
        const jobs = await Job.find();

        const userSkills = user.skills.map(skill => skill.toLowerCase());

        const matchedJobs = jobs.map(job=>{
            const requiredSkills = job.skillsRequired.map(skill => skill.toLowerCase());

            let matchCount = 0;
            let missingSkills = [];

            requiredSkills.forEach(skill => {
                if(userSkills.includes(skill)){
                    matchCount++;
                }else{
                    missingSkills.push(skill)
                };
            });

            const matchPercentage = Math.round(
                (matchCount / requiredSkills.length) * 100
            );

            return {
                ...job._doc,
                matchPercentage,
                missingSkills
            };
        });

        matchedJobs.sort((a,b)=> b.matchPercentage - a.matchPercentage);

        res.status(200).json(matchedJobs);
    } catch (error) {
        next(error)
    }
};