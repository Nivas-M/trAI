"use client";

import { useState } from "react";

export default function ResultCard({ journey, reason, onSave }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      await onSave?.(journey, reason);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save journey:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{journey.train}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {journey.comfort}
          </span>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                saved
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              } disabled:opacity-60`}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
            </button>
          )}
        </div>
      </div>

      {(journey.departure || journey.arrival) && (
        <div className="flex gap-4 mt-2 text-sm text-gray-700">
          {journey.departure && <span>Departs: <strong>{journey.departure}</strong></span>}
          {journey.arrival && <span>Arrives: <strong>{journey.arrival}</strong></span>}
        </div>
      )}

      <div className="flex gap-4 mt-2 text-sm text-gray-600">
        <span>{journey.durationHours} hrs</span>
        <span>Rs. {journey.price}</span>
        {journey.reliability && (
          <span>{journey.reliability} reliability</span>
        )}
      </div>

      {reason && (
        <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded text-sm text-gray-700">
          <strong className="text-amber-800">Why this option?</strong>
          <p className="mt-1">{reason.reason || reason}</p>
        </div>
      )}

      {reason?.notes && reason.notes.length > 0 && (
        <div className="mt-3 space-y-1">
          <strong className="text-xs text-gray-500 uppercase tracking-wide">Extra Info</strong>
          <ul className="text-sm text-gray-600 space-y-1">
            {reason.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">-</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
