"use client";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { getSavedJourneys, deleteSavedJourney } from "@/lib/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoadError(null);
    getSavedJourneys(user.uid)
      .then(setJourneys)
      .catch((err) => {
        console.error(err);
        setLoadError("Failed to load your trips. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteSavedJourney(id);
      setJourneys((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" aria-label="Home">
              <h1 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">trAI</h1>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Dashboard navigation">
              <Link
                href="/"
                className="text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
              >
                New Search
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

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-6">My Saved Trips</h2>

          {loading ? (
            <div className="flex flex-col items-center py-16 gap-3" aria-live="polite" aria-busy="true">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <p className="text-zinc-500 text-sm">Loading your trips...</p>
            </div>
          ) : loadError ? (
            <div role="alert" className="text-center py-16 bg-red-500/5 rounded-xl border border-red-500/10">
              <p className="text-red-400">{loadError}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setLoadError(null);
                  getSavedJourneys(user.uid)
                    .then(setJourneys)
                    .catch(() => setLoadError("Failed to load your trips. Please try again."))
                    .finally(() => setLoading(false));
                }}
                className="mt-4 bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2 rounded-lg hover:bg-red-500/30 transition"
              >
                Try Again
              </button>
            </div>
          ) : journeys.length === 0 ? (
            <div className="text-center py-16 bg-white/2 rounded-xl border border-white/5">
              <p className="text-zinc-500 text-base">No saved trips yet.</p>
              <Link
                href="/"
                className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition text-sm font-medium"
              >
                Plan a Journey
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4" role="list" aria-label="Saved trips">
              {journeys.map((j) => (
                <article
                  key={j.id}
                  role="listitem"
                  className={`rounded-xl border bg-[#13131a] p-4 sm:p-5 hover:border-white/20 transition-all ${j.connecting ? "border-indigo-500/20" : "border-white/10"}`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {j.connecting && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">Connecting</span>
                      )}
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-100">{j.train}</h3>
                      {!j.connecting && (
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                          {j.comfort}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(j.id)}
                      disabled={deleting === j.id}
                      aria-label={`Remove ${j.train}`}
                      className="text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-1 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === j.id ? "Removing..." : "Remove"}
                    </button>
                  </div>

                  {j.connecting ? (
                    <>
                      <div className="mt-2 text-sm font-medium flex flex-wrap items-center gap-1.5">
                        <span className="text-zinc-200">{j.from}</span>
                        <span className="text-zinc-600" aria-hidden="true">→</span>
                        <span className="text-indigo-400">{j.via}</span>
                        <span className="text-zinc-600" aria-hidden="true">→</span>
                        <span className="text-zinc-200">{j.to}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="bg-white/3 rounded-lg p-2.5 text-sm text-zinc-400 border border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Leg 1:</span> {j.leg1.train} — {j.leg1.fromStation} ({j.leg1.fromCode}) → {j.leg1.toStation} ({j.leg1.toCode}), {j.leg1.departure}–{j.leg1.arrival}, <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold"><span className="text-emerald-500/60">₹</span>{Number(j.leg1.price).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="bg-white/3 rounded-lg p-2.5 text-sm text-zinc-400 border border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Leg 2:</span> {j.leg2.train} — {j.leg2.fromStation} ({j.leg2.fromCode}) → {j.leg2.toStation} ({j.leg2.toCode}), {j.leg2.departure}–{j.leg2.arrival}, <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold"><span className="text-emerald-500/60">₹</span>{Number(j.leg2.price).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
                        <span>~{j.totalDuration} hrs + layover</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg text-sm font-semibold"><span className="text-emerald-500/60 text-xs">₹</span>{Number(j.totalPrice).toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-zinc-400 mt-1">
                        {j.fromStation || j.from}
                        {j.fromCode && <span className="text-xs text-zinc-600"> ({j.fromCode})</span>}
                        {" "}→{" "}
                        {j.toStation || j.to}
                        {j.toCode && <span className="text-xs text-zinc-600"> ({j.toCode})</span>}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
                        <span>{j.durationHours} hrs</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg text-sm font-semibold"><span className="text-emerald-500/60 text-xs">₹</span>{Number(j.price).toLocaleString("en-IN")}</span>
                        {j.reliability && <span>{j.reliability} reliability</span>}
                      </div>
                    </>
                  )}

                  {j.reason && (
                    <div className="mt-3 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-sm">
                      <strong className="text-indigo-400 text-xs uppercase tracking-wide">Why this option?</strong>
                      <p className="mt-1 text-zinc-400">{j.reason}</p>
                    </div>
                  )}

                  {j.notes && j.notes.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <strong className="text-[10px] text-zinc-500 uppercase tracking-wider">Extra Info</strong>
                      <ul className="text-sm text-zinc-400 space-y-1" aria-label="Additional notes">
                        {j.notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-500 mt-0.5 shrink-0" aria-hidden="true">-</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {j.query && (
                    <p className="mt-3 text-xs text-zinc-600 italic">
                      Original search: &quot;{j.query}&quot;
                    </p>
                  )}

                  {j.savedAt && (
                    <p className="mt-1 text-xs text-zinc-600">
                      Saved {j.savedAt.toDate?.().toLocaleDateString() || ""}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
