import model from "../config/gemini.js";
import Resume from "../models/resume.model.js";
import Interview from "../models/interview.model.js";
import logger from "../utils/logger.js";

const VALID_TYPES = ['HR', 'DSA', 'MERN', 'RESUME'];

const buildPrompt = (type, resumeText) => {
    const base = `Generate exactly 25 ${type} interview questions structured by difficulty: 10 Basic, 10 Medium, 5 Advanced.
Return ONLY valid JSON array:
[{ "type": "technical", "question": "Question text here" }]`;

    if (type === 'RESUME') {
        return `Based on this resume:\n${resumeText || 'No resume provided'}\n\n${base}`;
    }
    const labels = { HR: 'HR', DSA: 'DSA (Data Structures & Algorithms)', MERN: 'MERN stack' };
    return `Generate exactly 25 ${labels[type]} interview questions.\n${base}`;
};

export const generateQuestions = async (req, res, next) => {
    try {
        const { type } = req.body;

        if (!type || !VALID_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `type must be one of: ${VALID_TYPES.join(', ')}`
            });
        }

        let resumeText = null;
        if (type === 'RESUME') {
            const resume = await Resume.findOne({ userId: req.user.id }).lean();
            resumeText = resume?.extractedText;
        }

        const prompt = buildPrompt(type, resumeText);
        const result = await model.generateContent(prompt);
        const rawText = result.response.text()
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();

        let questions;
        try {
            questions = JSON.parse(rawText);
        } catch {
            logger.error('Gemini returned malformed JSON for question generation');
            return res.status(502).json({ success: false, message: 'AI service returned invalid data. Please try again.' });
        }

        res.status(200).json({ success: true, questions });
    } catch (error) {
        logger.error('generateQuestions error:', error);
        next(error);
    }
};

export const evaluateAnswer = async (req, res, next) => {
    try {
        const { answers, type } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ success: false, message: 'answers array is required and cannot be empty' });
        }

        const prompt = `You are an expert technical interviewer.
Evaluate each interview answer carefully.
For EACH answer provide:
- technical_correctness (score out of 10)
- communication_clarity (score out of 10)
- confidence (score out of 10)
- strengths (array of strings)
- weaknesses (array of strings)
- improvement_tips (array of strings)

Return ONLY valid JSON array.
Example: [{"question":"What is JWT?","technical_correctness":8,"communication_clarity":7,"confidence":8,"strengths":["Good explanation"],"weaknesses":["Missed token expiry"],"improvement_tips":["Explain refresh token"]}]

Candidate Answers:
${JSON.stringify(answers)}`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text()
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();

        let evaluations;
        try {
            evaluations = JSON.parse(rawText);
        } catch {
            logger.error('Gemini returned malformed JSON for evaluation');
            return res.status(502).json({ success: false, message: 'AI evaluation failed. Please try again.' });
        }

        const total = evaluations.length || 1;
        const technicalScore  = evaluations.reduce((s, i) => s + (i.technical_correctness || 0), 0) / total;
        const communicationScore = evaluations.reduce((s, i) => s + (i.communication_clarity || 0), 0) / total;
        const confidenceScore = evaluations.reduce((s, i) => s + (i.confidence || 0), 0) / total;
        const overallScore = (technicalScore + communicationScore + confidenceScore) / 3;

        const overallFeedback = overallScore >= 8
            ? 'Excellent performance. Strong technical and communication skills.'
            : overallScore >= 6
            ? 'Good performance with some improvement areas.'
            : 'Needs improvement in technical concepts and communication.';

        const savedInterview = await Interview.create({
            userId: req.user.id,
            type,
            score: overallScore.toFixed(1),
            technicalScore: technicalScore.toFixed(1),
            communicationScore: communicationScore.toFixed(1),
            confidenceScore: confidenceScore.toFixed(1),
            feedback: overallFeedback,
            questions: evaluations.map((item, index) => ({
                question: item.question,
                answer: answers[index]?.answer || '',
                rating: ((item.technical_correctness + item.communication_clarity + item.confidence) / 3).toFixed(1),
                feedback: item.improvement_tips?.join(', ') || ''
            }))
        });

        res.status(200).json({
            success: true,
            evaluations,
            overallScore: overallScore.toFixed(1),
            technicalScore: technicalScore.toFixed(1),
            communicationScore: communicationScore.toFixed(1),
            confidenceScore: confidenceScore.toFixed(1),
            feedback: overallFeedback,
            interview: savedInterview
        });
    } catch (error) {
        logger.error('evaluateAnswer error:', error);
        next(error);
    }
};

export const getInterviewHistory = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [interviews, total] = await Promise.all([
            Interview.find({ userId: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Interview.countDocuments({ userId: req.user.id })
        ]);

        res.status(200).json({
            success: true,
            interviews,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};
