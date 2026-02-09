const JOURNEYS = [
  { id: 1, from: "Chennai", to: "Bangalore", fromStation: "Chennai Central", fromCode: "MAS", toStation: "KSR Bengaluru City", toCode: "SBC", train: "Shatabdi Express", departure: "06:00", arrival: "11:00", durationHours: 5, price: 780, comfort: "CC", reliability: "High" },
  { id: 2, from: "Chennai", to: "Bangalore", fromStation: "Chennai Central", fromCode: "MAS", toStation: "KSR Bengaluru City", toCode: "SBC", train: "Brindavan Express", departure: "07:50", arrival: "14:00", durationHours: 6.2, price: 350, comfort: "2S", reliability: "Medium" },
  { id: 3, from: "Chennai", to: "Bangalore", fromStation: "Chennai Egmore", fromCode: "MS", toStation: "Yesvantpur Junction", toCode: "YPR", train: "Lalbagh Express", departure: "22:15", arrival: "05:30", durationHours: 7.25, price: 420, comfort: "Sleeper", reliability: "Medium" },

  { id: 4, from: "Chennai", to: "Hyderabad", fromStation: "Chennai Central", fromCode: "MAS", toStation: "Secunderabad Junction", toCode: "SC", train: "Charminar Express", departure: "18:30", arrival: "06:45", durationHours: 12.25, price: 520, comfort: "Sleeper", reliability: "Medium" },
  { id: 5, from: "Chennai", to: "Hyderabad", fromStation: "Chennai Central", fromCode: "MAS", toStation: "Hyderabad Deccan", toCode: "HYB", train: "Telangana Express", departure: "06:25", arrival: "19:10", durationHours: 12.75, price: 890, comfort: "3A", reliability: "High" },

  { id: 6, from: "Bangalore", to: "Kochi", fromStation: "KSR Bengaluru City", fromCode: "SBC", toStation: "Ernakulam Junction", toCode: "ERS", train: "Kochuveli Express", departure: "20:30", arrival: "07:15", durationHours: 10.75, price: 480, comfort: "Sleeper", reliability: "Medium" },
  { id: 7, from: "Bangalore", to: "Kochi", fromStation: "Yesvantpur Junction", fromCode: "YPR", toStation: "Ernakulam Town", toCode: "ERN", train: "Garib Rath", departure: "22:00", arrival: "07:45", durationHours: 9.75, price: 750, comfort: "3A", reliability: "High" },

  { id: 8, from: "Delhi", to: "Jaipur", fromStation: "New Delhi", fromCode: "NDLS", toStation: "Jaipur Junction", toCode: "JP", train: "Shatabdi Express", departure: "06:05", arrival: "10:30", durationHours: 4.4, price: 870, comfort: "CC", reliability: "High" },
  { id: 9, from: "Delhi", to: "Jaipur", fromStation: "Delhi Sarai Rohilla", fromCode: "DEE", toStation: "Jaipur Junction", toCode: "JP", train: "Ajmer Shatabdi", departure: "17:40", arrival: "22:05", durationHours: 4.4, price: 690, comfort: "CC", reliability: "High" },
  { id: 10, from: "Delhi", to: "Jaipur", fromStation: "Old Delhi Junction", fromCode: "DLI", toStation: "Jaipur Junction", toCode: "JP", train: "Ashram Express", departure: "15:15", arrival: "21:45", durationHours: 6.5, price: 310, comfort: "Sleeper", reliability: "Low" },

  { id: 11, from: "Delhi", to: "Mumbai", fromStation: "New Delhi", fromCode: "NDLS", toStation: "Mumbai Central", toCode: "MMCT", train: "Rajdhani Express", departure: "16:35", arrival: "08:35", durationHours: 16, price: 2200, comfort: "2A", reliability: "High" },
  { id: 12, from: "Delhi", to: "Mumbai", fromStation: "Hazrat Nizamuddin", fromCode: "NZM", toStation: "Mumbai Central", toCode: "MMCT", train: "August Kranti Express", departure: "17:40", arrival: "11:10", durationHours: 17.5, price: 1650, comfort: "3A", reliability: "Medium" },
  { id: 13, from: "Delhi", to: "Mumbai", fromStation: "New Delhi", fromCode: "NDLS", toStation: "Chhatrapati Shivaji Terminus", toCode: "CSMT", train: "Golden Temple Mail", departure: "21:25", arrival: "19:50", durationHours: 22.4, price: 680, comfort: "Sleeper", reliability: "Low" },

  { id: 14, from: "Delhi", to: "Lucknow", fromStation: "New Delhi", fromCode: "NDLS", toStation: "Lucknow Junction", toCode: "LJN", train: "Swarn Shatabdi", departure: "06:10", arrival: "12:40", durationHours: 6.5, price: 950, comfort: "CC", reliability: "High" },
  { id: 15, from: "Delhi", to: "Lucknow", fromStation: "Anand Vihar Terminal", fromCode: "ANVT", toStation: "Lucknow Charbagh", toCode: "LKO", train: "Lucknow Mail", departure: "22:30", arrival: "06:45", durationHours: 8.25, price: 450, comfort: "Sleeper", reliability: "Medium" },

  { id: 16, from: "Mumbai", to: "Pune", fromStation: "Chhatrapati Shivaji Terminus", fromCode: "CSMT", toStation: "Pune Junction", toCode: "PUNE", train: "Deccan Queen", departure: "07:15", arrival: "10:30", durationHours: 3.25, price: 350, comfort: "CC", reliability: "High" },
  { id: 17, from: "Mumbai", to: "Pune", fromStation: "Dadar", fromCode: "DR", toStation: "Pune Junction", toCode: "PUNE", train: "Indrayani Express", departure: "09:05", arrival: "12:35", durationHours: 3.5, price: 180, comfort: "2S", reliability: "Medium" },

  { id: 18, from: "Mumbai", to: "Ahmedabad", fromStation: "Mumbai Central", fromCode: "MMCT", toStation: "Ahmedabad Junction", toCode: "ADI", train: "Shatabdi Express", departure: "06:25", arrival: "13:10", durationHours: 6.75, price: 920, comfort: "CC", reliability: "High" },
  { id: 19, from: "Mumbai", to: "Ahmedabad", fromStation: "Mumbai Central", fromCode: "MMCT", toStation: "Ahmedabad Junction", toCode: "ADI", train: "Karnavati Express", departure: "14:40", arrival: "23:00", durationHours: 8.3, price: 420, comfort: "Sleeper", reliability: "Medium" },

  { id: 20, from: "Kolkata", to: "Bhubaneswar", fromStation: "Howrah Junction", fromCode: "HWH", toStation: "Bhubaneswar", toCode: "BBS", train: "Shatabdi Express", departure: "06:10", arrival: "12:45", durationHours: 6.6, price: 880, comfort: "CC", reliability: "High" },
  { id: 21, from: "Kolkata", to: "Bhubaneswar", fromStation: "Howrah Junction", fromCode: "HWH", toStation: "Bhubaneswar", toCode: "BBS", train: "Coromandel Express", departure: "14:50", arrival: "21:20", durationHours: 6.5, price: 380, comfort: "Sleeper", reliability: "Medium" },
  { id: 22, from: "Kolkata", to: "Bhubaneswar", fromStation: "Santragachi Junction", fromCode: "SRC", toStation: "Bhubaneswar", toCode: "BBS", train: "Dhuli Express", departure: "23:15", arrival: "06:30", durationHours: 7.25, price: 340, comfort: "Sleeper", reliability: "Low" },

  { id: 23, from: "Bangalore", to: "Delhi", fromStation: "KSR Bengaluru City", fromCode: "SBC", toStation: "Hazrat Nizamuddin", toCode: "NZM", train: "Rajdhani Express", departure: "20:00", arrival: "06:15", durationHours: 34.25, price: 2800, comfort: "2A", reliability: "High" },
  { id: 24, from: "Bangalore", to: "Delhi", fromStation: "Yesvantpur Junction", fromCode: "YPR", toStation: "New Delhi", toCode: "NDLS", train: "Karnataka Express", departure: "21:30", arrival: "10:20", durationHours: 36.8, price: 780, comfort: "Sleeper", reliability: "Medium" },
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

function findConnections() {
  const routeMap = {};
  JOURNEYS.forEach(j => {
    const key = `${j.from}|${j.to}`;
    if (!routeMap[key]) routeMap[key] = [];
    routeMap[key].push(j);
  });

  const connections = [];
  const routeKeys = Object.keys(routeMap);

  for (const r1 of routeKeys) {
    for (const r2 of routeKeys) {
      const [from1, to1] = r1.split("|");
      const [from2, to2] = r2.split("|");
      if (to1 === from2 && from1 !== to2) {
        const directKey = `${from1}|${to2}`;
        if (!routeMap[directKey]) {
          connections.push({
            from: from1,
            to: to2,
            via: to1,
            leg1Trains: routeMap[r1],
            leg2Trains: routeMap[r2],
          });
        }
      }
    }
  }
  return connections;
}

const CONNECTIONS = findConnections();

export async function POST(request) {
  try {
    const { input, history } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemma-3-27b-it",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const routes = [...new Set(JOURNEYS.map((j) => `${j.from} to ${j.to}`))].join(", ");

    const trainList = JOURNEYS.map((j, idx) => 
      `${idx + 1}. ${j.train} [${j.from} to ${j.to}]: Boards at ${j.fromStation} (${j.fromCode}), arrives at ${j.toStation} (${j.toCode}), departs ${j.departure}, arrives ${j.arrival}, takes ${j.durationHours} hours, costs Rs.${j.price}, ${j.comfort} class, reliability: ${j.reliability}`
    ).join('\n');

    const connectionList = CONNECTIONS.map(c => {
      const leg1Names = c.leg1Trains.map(t => t.train).join(", ");
      const leg2Names = c.leg2Trains.map(t => t.train).join(", ");
      return `${c.from} to ${c.to} via ${c.via} — Leg 1 options: [${leg1Names}], Leg 2 options: [${leg2Names}]`;
    }).join('\n');

    const connectionRoutes = CONNECTIONS.map(c => `${c.from} to ${c.to} (via ${c.via})`).join(", ");

    const prompt = `You are an Indian railways travel assistant. The user said: "${input}"

Available DIRECT routes: ${routes}
Available CONNECTING routes (2 trains with layover): ${connectionRoutes || "none"}

All trains:
${trainList}

Connecting route details:
${connectionList || "none"}

STEP 1 — ROUTE MATCHING:
Determine if the user's query matches any available route (direct OR connecting). The user may use abbreviations (blore, blr, chn), misspellings (banglore, bengluru), local names (Madras for Chennai), or station codes (MAS, SBC). Use your knowledge to interpret what the user means.

If the user's requested route does NOT match ANY available direct or connecting route, respond with EXACTLY:
{"no_route": true, "message": "No trains found for this route. We currently support: ${routes}. Connecting: ${connectionRoutes || 'none'}."}

STEP 2 — DIRECT ROUTE: If a direct route matches, rank the matching trains best-to-worst.
For each train provide:
- "train": exact train name from the list
- "reason": explanation string
- "notes": array of short helpful strings (can be empty [])

STEP 3 — CONNECTING ROUTE: If no direct route matches but a connecting route exists, suggest 1-3 best combinations.
For each combination provide:
- "connecting": true
- "via": the connecting city name
- "leg1": exact train name for the first leg
- "leg2": exact train name for the second leg
- "reason": explanation of why this combination is good
- "notes": array of helpful strings (layover tips, connection advice, etc.)

IMPORTANT: Only use train names that EXACTLY match the list above. For connecting routes, leg1 must be a train on the first route segment and leg2 must be a train on the second segment.

Respond with ONLY valid JSON. Either the no_route object OR a JSON array ordered best to worst.

Example (direct route):
[{"train": "Shatabdi Express", "reason": "Fastest at 5 hours", "notes": ["Departs from Chennai Central"]}]

Example (connecting route):
[{"connecting": true, "via": "Bangalore", "leg1": "Shatabdi Express", "leg2": "Rajdhani Express", "reason": "Fastest connection via Bangalore", "notes": ["Allow 4-6 hours layover at Bengaluru", "Both trains have high reliability"]}]

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

      if (aiResult && aiResult.no_route) {
        return new Response(
          JSON.stringify({
            error: aiResult.message || "No trains found for this route.",
            errorType: "no_routes",
            results: [],
            reasoning: [],
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }
      
      if (Array.isArray(aiResult) && aiResult.length > 0) {
        const hasConnecting = aiResult.some(item => item.connecting);

        if (hasConnecting) {
          const connectingResults = aiResult.map(aiItem => {
            if (!aiItem.connecting) return null;
            const via = aiItem.via;
            const leg1Journey = JOURNEYS.find(j => j.train === aiItem.leg1 && j.to.toLowerCase() === via.toLowerCase());
            const leg2Journey = JOURNEYS.find(j => j.train === aiItem.leg2 && j.from.toLowerCase() === via.toLowerCase());
            if (!leg1Journey || !leg2Journey) return null;
            return {
              connecting: true,
              via: aiItem.via,
              train: `${leg1Journey.train} + ${leg2Journey.train}`,
              from: leg1Journey.from,
              to: leg2Journey.to,
              totalPrice: leg1Journey.price + leg2Journey.price,
              totalDuration: leg1Journey.durationHours + leg2Journey.durationHours,
              legs: [leg1Journey, leg2Journey],
            };
          }).filter(Boolean);

          const connectingReasoning = aiResult.filter(item => item.connecting).map(item => ({
            train: `${item.leg1} + ${item.leg2}`,
            reason: item.reason,
            notes: item.notes || [],
          }));

          return new Response(
            JSON.stringify({
              results: connectingResults,
              reasoning: connectingReasoning,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        const reorderedResults = aiResult.map(aiItem => 
          JOURNEYS.find(j => j.train === aiItem.train)
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
            results: JOURNEYS,
            reasoning: [],
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          error: "AI service is temporarily unavailable. Showing unranked results.",
          errorType: "ai_error",
          results: JOURNEYS,
          reasoning: [],
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        results: JOURNEYS,
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
