import mongoose from "mongoose";

/**
 * Quiz Schema
 * Stores AI-generated MCQ quiz sessions per user.
 * - questions array holds 10 items each with 4 options,
 *   a correctOption index (0-3), and category tag.
 * - score is null until the user submits answers.
 * - quizHistory on User model can reference these documents.
 */
const questionSchema = new mongoose.Schema({
    questionText: {
        type:     String,
        required: true,
        trim:     true,
    },
    options: {
        type:     [String],
        validate: {
            validator: (v) => v.length === 4,
            message:   "Each question must have exactly 4 options",
        },
    },
    correctOption: {
        type:     Number,  // 0–3 index into options[]
        required: true,
        min:      0,
        max:      3,
    },
    userAnswer: {
        type:    Number,   // null until submitted
        default: null,
    },
    category: {
        type:    String,   // Technical category tag e.g. "React", "Algorithms"
        trim:    true,
        default: "",
    },
});

const quizSchema = new mongoose.Schema(
    {
        userId: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      "User",
            required: true,
            index:    true,
        },
        tag: {
            type:     String,
            required: true,
            trim:     true,
        },
        score: {
            type:    Number,
            default: null, // null until quiz is submitted
        },
        questions: {
            type:     [questionSchema],
            validate: {
                validator: (v) => v.length === 10,
                message:   "A quiz must contain exactly 10 questions",
            },
        },
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
