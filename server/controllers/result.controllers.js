import mongoose from "mongoose";
import Result from "../models/result.model.js";

export const getUserResults = async (req, res, next) => {
    if(!req.user){
        return next({statusCode: 403, message: "You are not authorized !!!"});
    };

    try {
        const results = await Result.find({
            userId: req.user.id
        }).populate("testId", "title category")
        .lean();

        res.status(200).json({
            success: true,
            message: "Success",
            totalResults: results.length,
            results
        })
    } catch (error) {
        next(error);
    }
};

export const getResultById = async (req, res, next) => {
    const resultId = req.params.id;

    if(!req.user){
        return next({statusCode: 403, message: "You are not authorized !!!"});
    };

    if(!mongoose.Types.ObjectId.isValid(resultId)){
        return next({statusCode: 400, message: "Invalid mocktest Id"});
    };

    try {
        const result = await Result.findOne({
            _id: resultId,
            userId: req.user.id
        })
        .populate("testId", "title category")
        .lean();

        if(!result){
            return next({statusCode: 404, message: "Result not found"})
        }

        res.status(200).json({
            success:true,
            message: "success",
            result
        })
    } catch (error) {
        next(error);
    }
};

export const getResultsAnalytics = async (req, res, next) => {

    try {

        const results = await Result.find({
            userId: req.user.id
        });

        const totalTests = results.length;

        const totalScore = results.reduce(
            (acc, curr) => acc + curr.score,
            0
        );

        const totalQuestions = results.reduce(
            (acc, curr) => acc + curr.totalQuestion,
            0
        );

        const averageScore = totalTests
            ? (totalScore / totalTests).toFixed(1)
            : 0;

        const percentage = totalQuestions
            ? ((totalScore / totalQuestions) * 100).toFixed(1)
            : 0;

        const highestScore = results.length
            ? Math.max(...results.map(r => r.score))
            : 0;

        res.status(200).json({
            success: true,
            analytics: {
                totalTests,
                averageScore,
                highestScore,
                percentage
            }
        });

    } catch (error) {

        next(error);
    }
};