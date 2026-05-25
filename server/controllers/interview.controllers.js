import model from "../config/gemini.js";
import Resume from "../models/resume.model.js";
import Interview from "../models/interview.model.js";


export const generateQuestions = async (req, res, next) => {
    try {

        const { type } = req.body;
        // console.log(type);
        const resume = await Resume.findOne({
            userId: req.user.id
        });

        const resumeText = resume?.extractedText;

        let prompt = "";

        if (type === "HR") {
            prompt = `
            Generate 5 HR interview questions
            for a software engineer.

            Return ONLY valid JSON like this:

                [
                {
                "type":"technical",
                "question":"Explain JWT authentication."
                }
                ]
            `;
        }

        if (type === "DSA") {
            prompt = `
            Generate 5 DSA interview questions
            from easy to hard.
            
            Return ONLY valid JSON like this:

                [
                {
                "type":"technical",
                "question":"Explain JWT authentication."
                }
                ]
            `;
        }

        if (type === "MERN") {
            prompt = `
            Generate 5 MERN stack interview questions.
            
            Return ONLY valid JSON like this:

                [
                {
                "type":"technical",
                "question":"Explain JWT authentication."
                }
                ]
            `;
        }

        if (type === "RESUME") {
            prompt = `
            Based on this resume:
            ${resumeText}

            Generate 5 interview questions.
            
            Return ONLY valid JSON like this:

                [
                {
                "type":"technical",
                "question":"Explain JWT authentication."
                }
                ]
            `;
        }

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        // remove markdown if Gemini adds ```json
        const cleanText = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const questions = JSON.parse(cleanText);


        res.status(200).json({
            success: true,
            message: 'success',
            questions
        });

    } catch (error) {
        next(error);
    }
}

export const evaluateAnswer = async (req, res, next) => {

    try {

        const {
            answers,
            type
        } = req.body;

        /*
            answers = [
                {
                    question: "...",
                    answer: "..."
                }
            ]
        */

        const prompt = `
        You are an expert technical interviewer.

        Evaluate each interview answer carefully.

        For EACH answer provide:

        - technical_correctness (score out of 10)
        - communication_clarity (score out of 10)
        - confidence (score out of 10)
        - strengths
        - weaknesses
        - improvement_tips

        Return ONLY valid JSON array.

        Example format:

        [
          {
            "question": "What is JWT?",
            "technical_correctness": 8,
            "communication_clarity": 7,
            "confidence": 8,
            "strengths": ["Good explanation"],
            "weaknesses": ["Missed token expiry"],
            "improvement_tips": ["Explain refresh token"]
          }
        ]

        Candidate Answers:
        ${JSON.stringify(answers)}
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        const cleanText = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const evaluations = JSON.parse(cleanText);

        // SCORES
        let technicalTotal = 0;
        let communicationTotal = 0;
        let confidenceTotal = 0;

        evaluations.forEach((item) => {

            technicalTotal += item.technical_correctness;

            communicationTotal += item.communication_clarity;

            confidenceTotal += item.confidence;
        });

        const totalQuestions = evaluations.length;

        const technicalScore =
            technicalTotal / totalQuestions;

        const communicationScore =
            communicationTotal / totalQuestions;

        const confidenceScore =
            confidenceTotal / totalQuestions;

        const overallScore =
            (
                technicalScore +
                communicationScore +
                confidenceScore
            ) / 3;

        // OVERALL FEEDBACK
        let overallFeedback = "";

        if (overallScore >= 8) {

            overallFeedback =
                "Excellent performance. Strong technical and communication skills.";

        } else if (overallScore >= 6) {

            overallFeedback =
                "Good performance with some improvement areas.";

        } else {

            overallFeedback =
                "Needs improvement in technical concepts and communication.";
        }

        // SAVE INTERVIEW
        const savedInterview = await Interview.create({

            userId: req.user.id,

            type,

            score: overallScore.toFixed(1),

            technicalScore:
                technicalScore.toFixed(1),

            communicationScore:
                communicationScore.toFixed(1),

            confidenceScore:
                confidenceScore.toFixed(1),

            feedback: overallFeedback,

            questions: evaluations.map((item, index) => ({
                question: item.question,
                answer: answers[index].answer,
                rating:
                    (
                        item.technical_correctness +
                        item.communication_clarity +
                        item.confidence
                    ) / 3,
                feedback:
                    item.improvement_tips?.join(", ")
            }))
        });

        res.status(200).json({
            success: true,
            evaluations,
            overallScore: overallScore.toFixed(1),
            technicalScore:
                technicalScore.toFixed(1),
            communicationScore:
                communicationScore.toFixed(1),
            confidenceScore:
                confidenceScore.toFixed(1),
            feedback: overallFeedback,
            interview: savedInterview
        });

    } catch (error) {

        next(error);
    }
};

export const getInterviewHistory = async (req, res, next) => {

    try {

        const interviews = await Interview.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            interviews
        });

    } catch (error) {

        next(error);
    }
};

// export const evaluateAnswer = async (req, res, next) => {
//     try {

//         const { question, answer } = req.body;

//         const prompt = `
//             You are an expert technical interviewer.

//             Question:
//             ${question}

//             Candidate Answer:
//             ${answer}

//             Evaluate:

//             1. Technical_correctness (/10)
//             2. Communication_clarity (/10)
//             3. Confidence (/10)

//             Also provide:
//             - strengths
//             - weaknesses
//             - improvement_tips

//             Return ONLY valid JSON.
//             `;

//         const result = await model.generateContent(prompt);

//         const response = result.response.text();

//         const cleanText = response
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         const evaluation = JSON.parse(cleanText);

//         res.status(200).json(evaluation);

//     } catch (error) {
//         next(error);
//     }
// }


// export const evaluateAnswer = async (req, res, next) => {
//     try {

//         const { answers } = req.body;

//         /*
//             answers = [
//                 {
//                     question: "...",
//                     answer: "..."
//                 }
//             ]
//         */

//         const prompt = `
//         You are an expert technical interviewer.

//         Evaluate each interview answer carefully.

//         For EACH answer provide:

//         - technical_correctness (score out of 10)
//         - communication_clarity (score out of 10)
//         - confidence (score out of 10)
//         - strengths
//         - weaknesses
//         - improvement_tips

//         Return ONLY valid JSON array.

//         Example format:

//         [
//           {
//             "question": "What is JWT?",
//             "technical_correctness": 8,
//             "communication_clarity": 7,
//             "confidence": 8,
//             "strengths": ["Good explanation"],
//             "weaknesses": ["Missed token expiry"],
//             "improvement_tips": ["Explain refresh token"]
//           }
//         ]

//         Here are the candidate answers:

//         ${JSON.stringify(answers)}
//         `;

//         const result = await model.generateContent(prompt);

//         const response = result.response.text();

//         const cleanText = response
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         const evaluations = JSON.parse(cleanText);

//         // overall score calculation
//         const overallScore =
//             evaluations.reduce((acc, item) => {
//                 return acc +
//                     item.technical_correctness +
//                     item.communication_clarity +
//                     item.confidence;
//             }, 0) / (evaluations.length * 3);

//         res.status(200).json({
//             success: true,
//             evaluations,
//             overallScore: overallScore.toFixed(1)
//         });

//     } catch (error) {
//         next(error);
//     }
// };
