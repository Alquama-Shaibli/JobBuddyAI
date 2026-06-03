import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

if (!process.env.GEMINI_API_KEY) {
    logger.warn('GEMINI_API_KEY is not set — AI features will be unavailable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Use gemini-1.5-flash (v1beta) or fallback to gemini-pro
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
});

export default model;