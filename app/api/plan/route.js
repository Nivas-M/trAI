const JOURNEYS = [
  {
    id: 1,
    from: "Chennai",
    to: "Bangalore",
    train: "Chennai Express",
    departure: "06:00",
    arrival: "12:30",
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
    departure: "08:15",
    arrival: "14:00",
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
    departure: "22:30",
    arrival: "05:42",
    durationHours: 7.2,
    price: 400,
    comfort: "Sleeper",
    reliability: "Low",
  },
];

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function repairJSON(text) {
  const quoteCount = (text.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    text += '"';
  }

  const closers = { '[': ']', '{': '}' };
  const stack = [];
  let inString = false;
  let escaped = false;

  for (const ch of text) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '[' || ch === '{') stack.push(ch);
    if (ch === ']' || ch === '}') stack.pop();
  }

  while (stack.length > 0) {
    const open = stack.pop();
    text += closers[open];
  }

  try {
    return JSON.parse(text);
  } catch {
    const objects = [];
    const regex = /\{[^{}]*\}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      try {
        objects.push(JSON.parse(match[0]));
      } catch {}
    }
    return objects;
  }
}

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
      model: "gemma-3-27b-it",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const trainList = journeysToUse.map((j, idx) => 
      `${idx + 1}. ${j.train}: Departs ${j.departure}, arrives ${j.arrival}, takes ${j.durationHours} hours, costs Rs.${j.price}, ${j.comfort} class, reliability: ${j.reliability}`
    ).join('\n');

    const prompt = `You are an Indian railways travel assistant. The user said: "${input}"

Available trains in our database:
${trainList}

Task:
1. RANK the trains from BEST to WORST based on the user's preferences (if they mention "cheap", prioritize lowest price; if "fast", prioritize shortest duration; if "comfortable", prioritize better class).
2. For each train, provide a reason why it's a good or bad match.
3. Include any EXTRA helpful info as "notes" — an array of short strings. Examples of useful notes:
   - If the user might need to take 2 trains (connecting journey), mention it.
   - If the train departs from a nearby station instead of the city center, mention it.
   - Layover info, platform tips, booking advice, peak season warnings, etc.
   - If no extra notes, return an empty array.

Respond with ONLY a JSON array, ordered best to worst. Each object must have:
- "train": exact train name from the list
- "reason": explanation string
- "notes": array of short helpful strings (can be empty [])

Example format:
[{"train": "Chennai Express", "reason": "Cheapest option at ₹450", "notes": ["Departs from Chennai Central", "Often delayed by 30-60 min during monsoon"]}]

Conversation history:
${history.map(m => `User: ${m.text}`).join("\n")}
`;

    let aiResult = [];

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      console.log("Raw AI response:", text);
      console.log("Response length:", text.length);
      
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      try {
        aiResult = JSON.parse(text);
      } catch (parseErr) {
        console.log("Initial parse failed, attempting JSON repair...");
        aiResult = repairJSON(text);
      }
      console.log("Parsed AI result:", aiResult);
      
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

      const msg = err.message || "";
      if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
        const retryMatch = msg.match(/retry in ([\d.]+)/i);
        const retrySec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
        return new Response(
          JSON.stringify({
            error: `Rate limit reached. Please wait ~${retrySec}s and try again.`,
            errorType: "rate_limit",
            results: journeysToUse,
            reasoning: [],
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          error: "AI service is temporarily unavailable. Showing unranked results.",
          errorType: "ai_error",
          results: journeysToUse,
          reasoning: [],
        }),
        { headers: { "Content-Type": "application/json" } },
      );
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
      JSON.stringify({
        error: "Something went wrong. Please try again.",
        errorType: "server_error",
        results: [],
        reasoning: [],
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
