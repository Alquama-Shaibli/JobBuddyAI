import Resume from "../models/resume.model.js";
import { extractResume } from "../utils/resumeParser.js";
import { extractSkills } from "../utils/extractSkills.js";
import fs from 'fs';

export const uploadResume = async (req, res, next) => {

    try {

        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const extractedText = await extractResume(req.file.path);

        const skills = extractSkills(extractedText);

        const resume = await Resume.create({
            userId: req.user.id,
            resumeUrl: req.file.path,
            extractedText,
            skills
        });

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        next(error);
    }
};