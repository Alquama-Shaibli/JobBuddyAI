/**
 * POST /api/v1/ai/chat
 * Body: { message, skills?, targetRole? }
 *
 * Supports Google AI Studio project-based keys (AQ. prefix)
 * using x-goog-api-key header + multiple model/endpoint fallbacks.
 */

const GEMINI_MODELS = [
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.0-pro',
    'gemini-1.5-pro',
];

async function callGemini(prompt, apiKey) {
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    };

    const strategies = [];

    // Strategy A: x-goog-api-key header (project-based AI Studio keys)
    for (const model of GEMINI_MODELS) {
        strategies.push({
            label: `x-goog-api-key / ${model} / v1beta`,
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }
        });
        strategies.push({
            label: `x-goog-api-key / ${model} / v1`,
            url: `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }
        });
    }

    // Strategy B: key as URL query param
    for (const model of GEMINI_MODELS) {
        strategies.push({
            label: `URL-key / ${model} / v1beta`,
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Strategy C: Bearer token
    for (const model of GEMINI_MODELS) {
        strategies.push({
            label: `Bearer / ${model} / v1beta`,
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
        });
    }

    for (const s of strategies) {
        try {
            const response = await fetch(s.url, {
                method: 'POST',
                headers: s.headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log(`[Chat] ✅ Success via: ${s.label}`);
                    return text;
                }
            } else {
                const errText = await response.text();
                console.log(`[Chat] ❌ ${s.label} → ${response.status}: ${errText.slice(0, 120)}`);
            }
        } catch (e) {
            console.log(`[Chat] ❌ ${s.label} → fetch error: ${e.message}`);
        }
    }

    return null;
}

export const chatWithAI = async (req, res, next) => {
    try {
        const { message, skills, targetRole } = req.body;

        if (!message || !message.trim()) {
            return next({ statusCode: 400, message: 'Please provide a message' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        /* ── Build context ── */
        let contextBlock = '';
        if (targetRole || (Array.isArray(skills) && skills.length > 0)) {
            contextBlock = `
User Profile:
- Target Role: ${targetRole || 'Not specified'}
- Skills: ${Array.isArray(skills) && skills.length > 0 ? skills.join(', ') : 'Not specified'}
Use this to personalise your answers.`;
        }

        const fullPrompt = `You are JobBuddy AI — a friendly expert career coach.
${contextBlock}

Help with: resume tips, ATS optimization, interview prep, skill gaps, job search strategy.
Be concise, use bullet points. Stay on career topics.

User: ${message}`;

        const reply = await callGemini(fullPrompt, apiKey);

        if (!reply) {
            console.error('[Chat] All Gemini strategies failed. Key may be invalid or expired.');
            return res.status(200).json({
                success: true,
                reply: "I'm having trouble connecting to my AI engine right now. Your Gemini API key may be expired or invalid. Please visit https://aistudio.google.com/app/apikey to get a fresh key (AIza... format), add it to server/.env as GEMINI_API_KEY, then restart the server."
            });
        }

        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('[ChatWithAI Error]', error?.message || error);
        next(error);
    }
};