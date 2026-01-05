const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'mock-key'
});

const getChatResponse = async (message, context = []) => {
    if (!process.env.GROQ_API_KEY) {
        return "I am the Silent Disease AI Companion. I am currently running in demo mode (no API key configured). I would normally explain your risk factors and health trends.";
    }

    try {
        const systemPrompt = `
        You are 'Silent Disease AI', an advanced medical intelligence companion.
        Your goal is to explain health risks in a calm, explainable, and non-alarmist way.
        
        Tone: Professional, empathetic, and data-driven but accessible.
        NEVER give a definitive medical diagnosis. Always use language like "this suggests", "potential risk", "correlation".
        Always advise consulting a doctor for real concerns.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...context,
                { role: 'user', content: message }
            ],
            model: 'llama-3.1-8b-instant',
            max_tokens: 500, // Limit output tokens to save usage
        });

        return completion.choices[0]?.message?.content || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("Groq API Error:", error);
        if (error.status === 429) {
             return "I'm currently overloaded with requests (Rate Limit Reached). Please try again in a moment."; 
        }
        return "I apologize, but I'm unable to connect to my intelligence core right now.";
    }
};

const analyzeRisk = async (metrics) => {
    if (!process.env.GROQ_API_KEY) {
        // Mock fallback logic if no API key
        console.log("Mocking risk analysis (No API Key)");
        let baseRisk = 10;
        if (metrics.heartRate > 100) baseRisk += 20;
        if (metrics.stressLevel > 8) baseRisk += 15;
        if (metrics.sleepHours < 6) baseRisk += 10;
        if (metrics.age > 50) baseRisk += 10;
        return Math.min(baseRisk, 100);
    }

    try {
        const systemPrompt = `
        You are a Medical Risk Analysis Engine.
        Task: Analyze the provided health metrics and calculate a single integer "Risk Score" (0-100) representing the probability of silent health issues (like hypertension, pre-diabetes, etc.).
        
        Rules:
        - 0-20: Healthy / Low Risk
        - 21-50: Moderate Risk
        - 51-100: High Risk
        - Output ONLY the integer number. No text, no explanation.
        
        Metrics:
        ${JSON.stringify(metrics)}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: "Calculate risk score." }
            ],
            model: 'llama-3.1-8b-instant', 
        });

        const score = parseInt(completion.choices[0]?.message?.content?.trim());
        return isNaN(score) ? 15 : score; 
    } catch (error) {
        console.error("Risk Analysis Error:", error);
        if (error.status === 429 || error.code === 'model_decommissioned') {
            console.log("Model issue or rate limit, using fallback heuristic");
             // Fallback heuristic if AI fails
            let baseRisk = 20;
            if (metrics.heartRate > 100) baseRisk += 20;
            if (metrics.stressLevel > 6) baseRisk += 15;
            return baseRisk;
        }
        return 0;
    }
};

module.exports = { getChatResponse, analyzeRisk };
