import mongoose from "mongoose";
import Result from "../models/result.model.js";

export const getUserResults = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [results, total] = await Promise.all([
            Result.find({ userId: req.user.id })
                .populate('testId', 'title category')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Result.countDocuments({ userId: req.user.id })
        ]);

        res.status(200).json({
            success: true,
            totalResults: total,
            results,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};

export const getResultById = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid result ID' });
    }

    try {
        const result = await Result.findOne({ _id: id, userId: req.user.id })
            .populate('testId', 'title category')
            .lean();

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};

export const getResultsAnalytics = async (req, res, next) => {
    try {
        const results = await Result.find({ userId: req.user.id }).lean();

        const totalTests = results.length;
        const totalScore = results.reduce((acc, r) => acc + r.score, 0);
        const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestion, 0);
        const averageScore = totalTests ? (totalScore / totalTests).toFixed(1) : 0;
        const percentage = totalQuestions ? ((totalScore / totalQuestions) * 100).toFixed(1) : 0;
        const highestScore = results.length ? Math.max(...results.map(r => r.score)) : 0;

        res.status(200).json({
            success: true,
            analytics: { totalTests, averageScore, highestScore, percentage }
        });
    } catch (error) {
        next(error);
    }
};