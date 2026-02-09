"use client";

import ResultCard from "./components/resultCard";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [reasoning, setReasoning] = useState([]);
  const [messages, setMessages] = useState([]);

  const onSubmit = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", text: input }];

    setMessages(updatedMessages);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        history: updatedMessages,
      }),
    });

    const data = await res.json();
    setResult(data.results);
    setReasoning(data.reasoning || []);
    setInput("");
  };

  const reasonMap = {};
  reasoning.forEach((r) => {
    reasonMap[r.train] = r.reason;
  });

  return (
    <div className="p-8 h-screen flex flex-col items-center">
      <div className="text-3xl font-bold text-gray-900 flex bg-amber-200 w-full">
        <h1 className="bg-amber-500 w-fit py-3 px-6 rounded-xl">trAI</h1>
      </div>

      <div className="bg-amber-100 max-w-[70%] w-full mt-10 p-6 rounded-lg shadow">
        <input
          type="text"
          className="border border-gray-300 rounded w-full p-3 mb-4 focus:outline-none focus:border-blue-500"
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            result.length > 0
              ? "Refine your search (e.g. cheaper, faster)…"
              : "Describe your journey..."
          }
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded font-medium hover:bg-blue-700 transition"
          onClick={onSubmit}
        >
          Submit
        </button>

        {result.map((journey, index) => (
          <ResultCard
            key={index}
            journey={journey}
            reason={reasonMap[journey.train] || "No specific reason provided."}
          />
        ))}
      </div>
    </div>
  );
}
