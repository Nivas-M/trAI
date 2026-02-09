"use client";

import ResultCard from "./components/resultCard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { saveJourney } from "@/lib/firestore";
import Link from "next/link";

import { useState, useRef } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [reasoning, setReasoning] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

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
      inputRef.current?.focus();
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
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <h1 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">trAI</h1>
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
              >
                My Trips
              </Link>
              <span className="text-xs text-zinc-500 hidden md:inline max-w-[150px] truncate" title={user?.displayName || user?.email}>
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={logout}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
          {result.length === 0 && !submitting && messages.length === 0 && (
            <div className="mt-24 sm:mt-32 mb-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">Where are you headed?</h2>
              <p className="text-sm text-zinc-500">AI-powered train recommendations across India</p>
            </div>
          )}

          <div className={`w-full max-w-2xl ${result.length === 0 && !submitting && messages.length === 0 ? "" : "mt-6 sm:mt-8"}`}>
            <div className="relative rounded-xl border border-white/10 bg-[#13131a] shadow-lg shadow-black/20 p-1">
              <label htmlFor="journey-input" className="sr-only">Describe your journey</label>
              <input
                id="journey-input"
                ref={inputRef}
                type="text"
                value={input}
                className="w-full bg-transparent text-white placeholder-zinc-500 px-4 py-3.5 rounded-xl focus:outline-none disabled:text-zinc-600 transition text-sm sm:text-base"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                disabled={submitting}
                placeholder={
                  result.length > 0
                    ? "Refine your search (e.g. cheaper, faster)..."
                    : "Describe your journey..."
                }
                aria-describedby={alert ? "search-alert" : undefined}
              />
              <button
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={onSubmit}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting && (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {submitting ? "Searching..." : "Search"}
              </button>
            </div>

            {result.length === 0 && !submitting && messages.length === 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["Chennai → Bangalore", "Delhi → Mumbai", "Mumbai → Pune", "Kolkata → Bhubaneswar"].map((route) => (
                  <button
                    key={route}
                    onClick={() => { setInput(route); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition"
                  >
                    {route}
                  </button>
                ))}
              </div>
            )}

            {alert && (
              <div
                id="search-alert"
                role="alert"
                className={`mt-4 p-4 rounded-lg text-sm flex items-start justify-between gap-3 border ${
                  alert.type === "rate_limit"
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"
                    : alert.type === "network"
                    ? "bg-red-500/10 border-red-500/20 text-red-300"
                    : alert.type === "no_routes"
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                    : "bg-orange-500/10 border-orange-500/20 text-orange-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>{alert.message}</span>
                </div>
                <button
                  onClick={() => setAlert(null)}
                  className="text-zinc-500 hover:text-zinc-300 transition p-0.5"
                  aria-label="Dismiss alert"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {submitting && (
              <div className="mt-8 flex flex-col items-center gap-3 py-8" aria-live="polite">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <p className="text-sm text-zinc-500">Finding the best trains for you...</p>
              </div>
            )}

            {!submitting && result.length > 0 && (
              <div className="mt-6 flex flex-col gap-4 pb-8" role="list" aria-label="Train results">
                {result.map((journey, index) => (
                  <div key={index} role="listitem">
                    <ResultCard
                      journey={journey}
                      reason={reasonMap[journey.train] || "No specific reason provided."}
                      onSave={handleSave}
                      rank={index + 1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
