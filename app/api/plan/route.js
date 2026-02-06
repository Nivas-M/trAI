const JOURNEYS = [
  {
    id: 1,
    from: "Chennai",
    to: "Bangalore",
    train: "Chennai Express",
    durationHours: 6.5,
    price: 450,
    comfort: "Sleeper",
    reliability: "Medium",
  },
  {
    id: 2,
    from: "Chennai",
    to: "Bangalore",
    train: "Superfast SF",
    durationHours: 5.75,
    price: 650,
    comfort: "3A",
    reliability: "High",
  },
  {
    id: 3,
    from: "Chennai",
    to: "Bangalore",
    train: "Night Mail",
    durationHours: 7.2,
    price: 400,
    comfort: "Sleeper",
    reliability: "Low",
  },
];

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  const { input } = await request.json();

  const lower = input.toLowerCase();

  const filteredJourneys = JOURNEYS.filter(
    (j) =>
      lower.includes(j.from.toLowerCase()) &&
      lower.includes(j.to.toLowerCase()),
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
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

  return new Response(
    JSON.stringify({
      results: filteredJourneys,
      reasoning: aiResult,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
