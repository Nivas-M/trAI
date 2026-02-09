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
  try {
    const { input, history } = await request.json();

    const lower = input.toLowerCase();

    const filteredJourneys = JOURNEYS.filter(
      (j) =>
        lower.includes(j.from.toLowerCase()) &&
        lower.includes(j.to.toLowerCase()),
    );

    const journeysToUse = filteredJourneys.length > 0 ? filteredJourneys : JOURNEYS;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const trainList = journeysToUse.map((j, idx) => 
      `${idx + 1}. ${j.train}: Takes ${j.durationHours} hours, costs ₹${j.price}, ${j.comfort} class`
    ).join('\n');

    const exampleFormat = journeysToUse.map(j => 
      `{"train": "${j.train}", "reason": "your reason here"}`
    ).join(', ');

    const prompt = `You are helping a user choose between train options. The user said: "${input}"

Available trains:
${trainList}

Task:
1. RANK the trains from BEST to WORST based on the user's preferences (if they mention "cheap", prioritize lowest price; if "fast", prioritize shortest duration; if "comfortable", prioritize better class)
2. For each train, explain why it matches or doesn't match their needs

Respond with ONLY a JSON array with exactly ${journeysToUse.length} objects, ordered from best match to worst match:
[${exampleFormat}]
Conversation history:
${history.map(m => `User: ${m.text}`).join("\n")}
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
        const reorderedResults = aiResult.map(aiItem => 
          journeysToUse.find(j => j.train === aiItem.train)
        ).filter(Boolean);
        
        return new Response(
          JSON.stringify({
            results: reorderedResults,
            reasoning: aiResult,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }
    } catch (err) {
      console.error("AI error:", err);
      console.error("Failed text:", err.message);
    }

    return new Response(
      JSON.stringify({
        results: journeysToUse,
        reasoning: aiResult,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", results: [], reasoning: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
