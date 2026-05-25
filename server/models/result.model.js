import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockTest",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestion: {
        type: Number,
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId
            },
            selectedAnswer: {
                type: String
            },
            correctAnswer: {
                type: String
            }
        }
    ]
},{ timestamps: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;