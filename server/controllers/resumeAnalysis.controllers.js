import model from "../config/gemini.js";
import Resume from "../models/resume.model.js";

export const analyzeResume = async (req, res, next) => {
    try {

        const resume = await Resume.findOne({
            userId: req.user.id
        });

        if (!resume) {
            return next({
                statusCode: 404,
                message: "Resume not found"
            });
        }

        const resumeText = resume.extractedText;

        const prompt = `
        You are an expert ATS Resume Analyzer.

        Analyze this resume carefully.

        Resume:
        ${resumeText}

        Return ONLY valid JSON.

        Format:

        {
          "ats_score": 85,
          "strengths": [
            "Strong MERN stack projects"
          ],
          "weaknesses": [
            "No deployment experience"
          ],
          "missing_skills": [
            "Docker",
            "AWS"
          ],
          "recommended_roles": [
            {
              "role": "MERN Developer",
              "match_percentage": 90
            }
          ],
          "improvement_suggestions": [
            "Add measurable achievements",
            "Improve project descriptions"
          ],
          "section_recommendations": [
            {
              "section": "Experience",
              "recommendation": "Quantify your impact with metrics (e.g., increased performance by 20%)."
            }
          ],
          "resume_summary": "Good resume for MERN developer fresher."
        }
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        const cleanText = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(cleanText);

        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {
        next(error);
    }
};