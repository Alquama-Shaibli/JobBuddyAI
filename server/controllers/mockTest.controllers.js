import mongoose from 'mongoose';
import MockTest from '../models/mockTest.model.js';
import Result from '../models/result.model.js';

export const createMockTest = async (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: 'Only admins can create mock tests' });
    }

    const { title, category, questions, timeLimit } = req.body;

    if (!title || !category || !Array.isArray(questions) || questions.length === 0 || !timeLimit) {
        return res.status(400).json({ success: false, message: 'Please provide title, category, questions, and timeLimit' });
    }

    try {
        const mocktest = await MockTest.create({ title, category, questions, timeLimit });
        res.status(201).json({ success: true, message: 'Mock test created successfully', mocktest });
    } catch (error) {
        next(error);
    }
};

export const getAllMockTest = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [mockTests, total] = await Promise.all([
            MockTest.find()
                .select('-questions.correctAnswer')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            MockTest.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            totalMockTest: total,
            mockTest: mockTests,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};

export const getMockTestbyId = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid mock test ID' });
    }

    try {
        const mocktest = await MockTest.findById(id)
            .select('-questions.correctAnswer')
            .lean();

        if (!mocktest) {
            return res.status(404).json({ success: false, message: 'Mock test not found' });
        }

        res.status(200).json({ success: true, mocktest });
    } catch (error) {
        next(error);
    }
};

export const submitMockTest = async (req, res, next) => {
    const { id } = req.params;
    const { answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid mock test ID' });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ success: false, message: 'answers array is required' });
    }

    try {
        const mockTest = await MockTest.findById(id);
        if (!mockTest) {
            return res.status(404).json({ success: false, message: 'Mock test not found' });
        }

        let score = 0;
        const resultAnswers = mockTest.questions.map(question => {
            const userAnswer = answers.find(a => a.questionId === question._id.toString());
            const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
            if (isCorrect) score++;
            return {
                questionId: question._id,
                selectedAnswer: userAnswer?.selectedAnswer || '',
                correctAnswer: question.correctAnswer
            };
        });

        const result = await Result.create({
            userId: req.user.id,
            testId: id,
            score,
            totalQuestion: mockTest.questions.length,
            answers: resultAnswers
        });

        res.status(200).json({ success: true, message: 'Mock test submitted successfully', result });
    } catch (error) {
        next(error);
    }
};