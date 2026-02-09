"use client";

import ResultCard from "./components/resultCard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { saveJourney } from "@/lib/firestore";
import Link from "next/link";

import { useState } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [reasoning, setReasoning] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!input.trim() || submitting) return;
    setAlert(null);
    setSubmitting(true);

    const updatedMessages = [...messages, { role: "user", text: input }];

    setMessages(updatedMessages);

    try {
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

      if (data.error) {
        setAlert({ type: data.errorType || "error", message: data.error });
      }

      setResult(data.results || []);
      setReasoning(data.reasoning || []);
    } catch (err) {
      setAlert({ type: "network", message: "Network error. Check your connection and try again." });
    } finally {
      setInput("");
      setSubmitting(false);
    }
  };

  const handleSave = async (journey, reason) => {
    await saveJourney(user.uid, journey, reason, messages[0]?.text || "");
  };

  const reasonMap = {};
  reasoning.forEach((r) => {
    reasonMap[r.train] = r;
  });

  return (
    <ProtectedRoute>
      <div className="p-8 h-screen flex flex-col items-center">
        <div className="text-3xl font-bold text-gray-900 flex items-center justify-between bg-amber-200 w-full px-2 rounded-xl">
          <h1 className="bg-amber-500 w-fit py-3 px-6 rounded-xl">trAI</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              My Trips
            </Link>
            <span className="text-sm text-gray-700 hidden sm:inline">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

      <div className="bg-amber-100 max-w-[70%] w-full mt-10 p-6 rounded-lg shadow">
        <input
          type="text"
          value={input}
          className="border border-gray-300 rounded w-full p-3 mb-4 focus:outline-none focus:border-blue-500"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder={
            result.length > 0
              ? "Refine your search (e.g. cheaper, faster)…"
              : "Describe your journey..."
          }
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? "Searching…" : "Submit"}
        </button>

        {alert && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm flex items-start justify-between gap-3 ${
              alert.type === "rate_limit"
                ? "bg-yellow-50 border border-yellow-300 text-yellow-800"
                : alert.type === "network"
                ? "bg-red-50 border border-red-300 text-red-800"
                : "bg-orange-50 border border-orange-300 text-orange-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">
                {alert.type === "rate_limit" ? "⏳" : alert.type === "network" ? "🔌" : "⚠️"}
              </span>
              <span>{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {result.map((journey, index) => (
            <ResultCard
              key={index}
              journey={journey}
              reason={reasonMap[journey.train] || "No specific reason provided."}
              onSave={handleSave}
            />
          ))}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
