module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/api/plan/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
const JOURNEYS = [
    {
        id: 1,
        from: "Chennai",
        to: "Bangalore",
        train: "Chennai Express",
        durationHours: 6.5,
        price: 450,
        comfort: "Sleeper",
        reliability: "Medium"
    },
    {
        id: 2,
        from: "Chennai",
        to: "Bangalore",
        train: "Superfast SF",
        durationHours: 5.75,
        price: 650,
        comfort: "3A",
        reliability: "High"
    },
    {
        id: 3,
        from: "Chennai",
        to: "Bangalore",
        train: "Night Mail",
        durationHours: 7.2,
        price: 400,
        comfort: "Sleeper",
        reliability: "Low"
    }
];
;
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
async function POST(request) {
    try {
        const { input, history } = await request.json();
        const lower = input.toLowerCase();
        const filteredJourneys = JOURNEYS.filter((j)=>lower.includes(j.from.toLowerCase()) && lower.includes(j.to.toLowerCase()));
        const journeysToUse = filteredJourneys.length > 0 ? filteredJourneys : JOURNEYS;
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024
            }
        });
        const trainList = journeysToUse.map((j, idx)=>`${idx + 1}. ${j.train}: Takes ${j.durationHours} hours, costs ₹${j.price}, ${j.comfort} class`).join('\n');
        const exampleFormat = journeysToUse.map((j)=>`{"train": "${j.train}", "reason": "your reason here"}`).join(', ');
        const prompt = `You are helping a user choose between train options. The user said: "${input}"

Available trains:
${trainList}

Task:
1. RANK the trains from BEST to WORST based on the user's preferences (if they mention "cheap", prioritize lowest price; if "fast", prioritize shortest duration; if "comfortable", prioritize better class)
2. For each train, explain why it matches or doesn't match their needs

Respond with ONLY a JSON array with exactly ${journeysToUse.length} objects, ordered from best match to worst match:
[${exampleFormat}]
Conversation history:
${history.map((m)=>`User: ${m.text}`).join("\n")}
`;
        let aiResult = [];
        try {
            const result = await model.generateContent(prompt);
            let text = result.response.text().trim();
            console.log("Raw AI response:", text);
            console.log("Response length:", text.length);
            // Remove markdown code blocks
            text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            aiResult = JSON.parse(text);
            console.log("Parsed AI result:", aiResult);
            // Reorder results based on AI ranking
            if (aiResult.length > 0) {
                const reorderedResults = aiResult.map((aiItem)=>journeysToUse.find((j)=>j.train === aiItem.train)).filter(Boolean);
                return new Response(JSON.stringify({
                    results: reorderedResults,
                    reasoning: aiResult
                }), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        } catch (err) {
            console.error("AI error:", err);
            console.error("Failed text:", err.message);
        }
        return new Response(JSON.stringify({
            results: journeysToUse,
            reasoning: aiResult
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("API Route Error:", error);
        return new Response(JSON.stringify({
            error: "Internal server error",
            results: [],
            reasoning: []
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__57c30ca7._.js.map