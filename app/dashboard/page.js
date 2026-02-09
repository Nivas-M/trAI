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

  useEffect(() => {
    if (!user) return;
    getSavedJourneys(user.uid)
      .then(setJourneys)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    await deleteSavedJourney(id);
    setJourneys((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <ProtectedRoute>
      <div className="p-8 min-h-screen flex flex-col items-center">
        <div className="text-3xl font-bold text-gray-900 flex items-center justify-between bg-amber-200 w-full px-2 rounded-xl">
          <Link href="/">
            <h1 className="bg-amber-500 w-fit py-3 px-6 rounded-xl cursor-pointer">trAI</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              New Search
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

        <div className="w-full max-w-[70%] mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Saved Trips</h2>

          {loading ? (
            <div className="text-amber-600 text-lg font-medium animate-pulse text-center py-12">
              Loading your trips…
            </div>
          ) : journeys.length === 0 ? (
            <div className="text-center py-16 bg-amber-50 rounded-lg">
              <p className="text-gray-500 text-lg">No saved trips yet.</p>
              <Link
                href="/"
                className="inline-block mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Plan a Journey
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {journeys.map((j) => (
                <div
                  key={j.id}
                  className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{j.train}</h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {j.comfort}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {j.from} → {j.to}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{j.durationHours} hrs</span>
                    <span>Rs. {j.price}</span>
                    {j.reliability && (
                      <span>{j.reliability} reliability</span>
                    )}
                  </div>

                  {j.reason && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded text-sm text-gray-700">
                      <strong className="text-amber-800">Why this option?</strong>
                      <p className="mt-1">{j.reason}</p>
                    </div>
                  )}

                  {j.notes && j.notes.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <strong className="text-xs text-gray-500 uppercase tracking-wide">Extra Info</strong>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {j.notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">-</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {j.query && (
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Original search: "{j.query}"
                    </p>
                  )}

                  {j.savedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      Saved {j.savedAt.toDate?.().toLocaleDateString() || ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
