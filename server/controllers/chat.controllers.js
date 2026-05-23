import model from "../config/gemini.js";
// console.log(process.env.GEMINI_API_KEY);
export const chatWithAI = async (req, res, next) => {
    try {
        const { message } = req.body;

        if(!message){
            return next({
                statusCode: 401,
                message: "Please provide message"
            });
        };

        const prompt = `
            You are JobBuddy AI Assistant.

            Your role:
            - Help users with jobs
            - Career guidance
            - Resume tips
            - Interview preparation
            - Skill recommendations
            - Job searching

            User Message:
            ${message}
            `;
        
        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.status(200).json({
            success: true,
            reply: response
        })
    } catch (error) {
        next(error)
    }
};