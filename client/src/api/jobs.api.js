import API from "./axios";

// Get all jobs with optional filters
export const getAllJobs = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await API.get(`/jobs/getAllJobs?${query}`);
    return response.data;
};

// Get AI-matched jobs for current user
export const getMatchedJobs = async () => {
    const response = await API.get('/jobs/match');
    return response.data;
};

// Analyze resume
export const analyzeResume = async () => {
    const response = await API.post('resume/analyze');
    return response.data;
};
