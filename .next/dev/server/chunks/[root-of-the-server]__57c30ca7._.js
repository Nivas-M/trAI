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
    const { input } = await request.json();
    const lower = input.toLowerCase();
    const filteredJourneys = JOURNEYS.filter((j)=>lower.includes(j.from.toLowerCase()) && lower.includes(j.to.toLowerCase()));
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview"
    });
    const prompt = `
User input:
"${input}"

Available train options:
${JSON.stringify(filteredJourneys, null, 2)}

Task:
1. Rank the train options based on user preference.
2. Add a short reason for each option.

Return ONLY valid JSON in this format:
[
  {
    "train": "...",
    "reason": "..."
  }
]
`;
    let aiResult = [];
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        aiResult = JSON.parse(text);
    } catch (err) {
        console.error("Gemini error or JSON parse error:", err);
    }
    return new Response(JSON.stringify({
        results: filteredJourneys,
        reasoning: aiResult
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__57c30ca7._.js.map