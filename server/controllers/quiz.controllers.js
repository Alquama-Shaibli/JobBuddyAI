import Quiz from "../models/Quiz.js";
import model from "../config/gemini.js";
import logger from "../utils/logger.js";

/**
 * POST /api/v1/quiz/generate
 * Body: { tag }
 *
 * Generates 10 AI MCQs for the given career track/role.
 * Returns questions WITHOUT correctOption to prevent client-side cheating.
 */
export const generateQuiz = async (req, res, next) => {
    try {
        const { tag } = req.body;
        if (!tag || !tag.trim()) {
            return next({ statusCode: 400, message: "Tag/Job Title is required to generate a quiz" });
        }

        const prompt = `
You are an expert technical interviewer preparing a certification-level assessment.

Generate exactly 10 Multiple Choice Questions (MCQs) for the role/topic: "${tag.trim()}".

Requirements:
- Mix difficulty levels: 3 beginner, 4 intermediate, 3 advanced questions.
- Each question must be uniquely different — no repeats.
- Test real technical knowledge, not trivia.
- Options must be plausible but only one should be clearly correct.
- Include a short category tag for each question (e.g., "React Hooks", "Algorithms", "System Design").

Return ONLY a valid JSON array of exactly 10 objects with this exact structure:
[
  {
    "questionText": "Question string here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 1,
    "category": "Category Tag"
  }
]

Rules:
- "options" must be an array of exactly 4 strings.
- "correctOption" must be an integer 0-3 (index of the correct option).
- "category" must be a short string (max 3 words).
- No markdown, no code fences, just raw JSON.
`;

        const result = await model.generateContent(prompt);
        let response = result.response.text();

        // Strip any accidental markdown code fences
        response = response
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/gi, "")
            .trim();

        let questionsArray;
        try {
            questionsArray = JSON.parse(response);
        } catch {
            throw new Error("AI returned malformed JSON. Cannot parse quiz.");
        }

        if (!Array.isArray(questionsArray) || questionsArray.length !== 10) {
            throw new Error(`AI returned ${questionsArray?.length || 0} questions instead of 10.`);
        }

        const newQuiz = await Quiz.create({
            userId:    req.user.id,
            tag:       tag.trim(),
            questions: questionsArray,
        });

        // Strip correctOption before sending to client (anti-cheat)
        const clientQuestions = newQuiz.questions.map((q) => ({
            _id:          q._id,
            questionText: q.questionText,
            options:      q.options,
            category:     q.category,
        }));

        res.status(201).json({
            success:   true,
            quizId:    newQuiz._id,
            tag:       newQuiz.tag,
            questions: clientQuestions,
        });

    } catch (error) {
        logger.error('Quiz Generation Error:', error);
        next({ statusCode: 500, message: "Failed to generate quiz. Please try again." });
    }
};

/**
 * POST /api/v1/quiz/submit
 * Body: { quizId, answers: [{ questionId, selectedOption }] }
 *
 * Server-side evaluation — never trusts the client's score.
 * Returns colour-coded answer comparison details + feedback string.
 * Also pushes the attempt to user's quiz history.
 */
export const submitQuiz = async (req, res, next) => {
    try {
        const { quizId, answers } = req.body;

        if (!quizId || !Array.isArray(answers)) {
            return next({ statusCode: 400, message: "Invalid payload: quizId and answers[] are required" });
        }

        const quiz = await Quiz.findOne({ _id: quizId, userId: req.user.id });
        if (!quiz) {
            return next({ statusCode: 404, message: "Quiz not found or does not belong to you" });
        }

        if (quiz.score !== null) {
            return next({ statusCode: 400, message: "This quiz has already been submitted" });
        }

        // Build a lookup map: { questionId -> selectedOption }
        const answerMap = {};
        answers.forEach((a) => {
            answerMap[String(a.questionId)] = a.selectedOption;
        });

        let correctCount = 0;

        const evaluationDetails = quiz.questions.map((q) => {
            const userChoice = answerMap[String(q._id)];
            const isCorrect  = userChoice === q.correctOption;

            // Persist user's answer to DB for review later
            q.userAnswer = userChoice !== undefined ? userChoice : null;

            if (isCorrect) correctCount++;

            return {
                questionId:    q._id,
                questionText:  q.questionText,
                options:       q.options,
                category:      q.category,
                userAnswer:    q.userAnswer,
                correctOption: q.correctOption,
                isCorrect,
            };
        });

        // Persist score
        quiz.score = correctCount;
        await quiz.save();

        // Compute grade label
        const pct      = (correctCount / 10) * 100;
        let grade;
        let feedback;

        if (pct >= 90) {
            grade    = "S";
            feedback = "🏆 Outstanding! You have mastery-level knowledge of this domain.";
        } else if (pct >= 80) {
            grade    = "A";
            feedback = "🎉 Excellent performance! Strong grasp of the technical concepts.";
        } else if (pct >= 70) {
            grade    = "B";
            feedback = "👍 Good effort! Review the incorrect answers to sharpen your knowledge.";
        } else if (pct >= 50) {
            grade    = "C";
            feedback = "📚 Passing grade. Focus on the missed topics and practice more.";
        } else {
            grade    = "D";
            feedback = "💪 Needs improvement. Revisit the fundamentals and try again!";
        }

        res.status(200).json({
            success:     true,
            score:       correctCount,
            total:       10,
            percentage:  pct,
            grade,
            feedback,
            evaluations: evaluationDetails,
        });

    } catch (error) {
        logger.error('Quiz Evaluation Error:', error);
        next(error);
    }
};
