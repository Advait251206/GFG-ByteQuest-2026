const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getChatResponse = async (message, context = []) => {
    if (!process.env.GEMINI_API_KEY) {
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

        // Format history for Gemini (chat session)
        // Gemini expects: { role: "user" | "model", parts: [{ text: "..." }] }
        const historyForGemini = context.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist as the Silent Disease AI Companion." }],
                },
                ...historyForGemini
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I apologize, but I'm unable to connect to my intelligence core right now.";
    }
};

const analyzeRisk = async (metrics) => {
    if (!process.env.GEMINI_API_KEY) {
        // Mock fallback logic
        console.log("Mocking risk analysis (No API Key)");
        let baseRisk = 10;
        if (metrics.heartRate > 100) baseRisk += 20;
        if (metrics.stressLevel > 8) baseRisk += 15;
        if (metrics.sleepHours < 6) baseRisk += 10;
        if (metrics.age > 50) baseRisk += 10;
        return Math.min(baseRisk, 100);
    }

    try {
        const prompt = `
        You are a Medical Risk Analysis Engine.
        Task: Analyze the provided health metrics and calculate a single integer "Risk Score" (0-100) representing the probability of silent health issues.
        
        Rules:
        - 0-20: Healthy / Low Risk
        - 21-50: Moderate Risk
        - 51-100: High Risk
        - Output ONLY the integer number. No text, no explanation.
        
        Metrics:
        ${JSON.stringify(metrics)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const score = parseInt(text.trim());
        return isNaN(score) ? 15 : score; 

    } catch (error) {
        console.error("Risk Analysis Error:", error);
        // Fallback heuristic
        let baseRisk = 20;
        if (metrics.heartRate > 100) baseRisk += 20;
        if (metrics.stressLevel > 6) baseRisk += 15;
        return baseRisk;
    }
};

module.exports = { getChatResponse, analyzeRisk };
