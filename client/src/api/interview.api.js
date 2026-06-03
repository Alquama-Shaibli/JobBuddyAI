import API from "./axios";

// Generate interview questions
export const generateInterviewQuestions = async (type) => {
    const response = await API.post('/interview/generate', { type });
    return response.data;
};

// Evaluate answers
export const evaluateInterviewAnswers = async (answers, type) => {
    const response = await API.post('/interview/evaluate', { answers, type });
    return response.data;
};

// Get interview history
export const getInterviewHistory = async () => {
    const response = await API.get('/interview/history');
    return response.data;
};
