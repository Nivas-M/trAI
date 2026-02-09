"use client";

import { useState } from "react";

export default function ResultCard({ journey, reason, onSave, rank }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      await onSave?.(journey, reason);
      setSaved(true);
    } catch (err) {
      setSaveError(true);
      console.error("Failed to save journey:", err);
    } finally {
      setSaving(false);
    }
  };

  const reliabilityColor = {
    High: "text-emerald-400",
    Medium: "text-amber-400",
    Low: "text-red-400",
  };

  if (journey.connecting) {
    const leg1 = journey.legs[0];
    const leg2 = journey.legs[1];

    return (
      <article
        className="rounded-xl border border-indigo-500/20 bg-[#13131a] p-4 sm:p-5 hover:border-indigo-500/40 transition-all"
        aria-label={`Connecting journey via ${journey.via} — rank ${rank || ""}`}
      >
        <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0" aria-label={`Rank ${rank}`}>
                {rank}
              </span>
            )}
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
              Connecting
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={handleSave}
                disabled={saved || saving}
                aria-label={saved ? "Journey saved" : "Save journey"}
                className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                  saved
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : saveError
                    ? "bg-red-500/15 text-red-400 border border-red-500/20"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:border-indigo-500/30"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {saving ? "Saving..." : saved ? "Saved" : saveError ? "Retry" : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm font-medium flex flex-wrap items-center gap-1.5">
          <span className="text-zinc-200">{leg1.from}</span>
          <span className="text-zinc-600" aria-hidden="true">→</span>
          <span className="text-indigo-400">{journey.via}</span>
          <span className="text-zinc-600" aria-hidden="true">→</span>
          <span className="text-zinc-200">{leg2.to}</span>
        </div>

        <div className="mt-3 space-y-3">
          <div className="bg-white/3 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Leg 1</span>
              <h3 className="text-sm font-semibold text-zinc-100">{leg1.train}</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 ml-auto">{leg1.comfort}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
              <span className="text-zinc-300">{leg1.fromStation}</span>
              {leg1.fromCode && <span className="text-xs text-zinc-600">({leg1.fromCode})</span>}
              <span className="text-zinc-600" aria-hidden="true">→</span>
              <span className="text-zinc-300">{leg1.toStation}</span>
              {leg1.toCode && <span className="text-xs text-zinc-600">({leg1.toCode})</span>}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-zinc-500">
              <span>{leg1.departure} – {leg1.arrival}</span>
              <span>{leg1.durationHours} hrs</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold"><span className="text-emerald-500/60">₹</span>{leg1.price.toLocaleString("en-IN")}</span>
              <span className={reliabilityColor[leg1.reliability] || "text-zinc-500"}>{leg1.reliability}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3">
            <div className="flex-1 border-t border-dashed border-white/10" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 whitespace-nowrap">Change at {journey.via}</span>
            <div className="flex-1 border-t border-dashed border-white/10" />
          </div>

          <div className="bg-white/3 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Leg 2</span>
              <h3 className="text-sm font-semibold text-zinc-100">{leg2.train}</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 ml-auto">{leg2.comfort}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
              <span className="text-zinc-300">{leg2.fromStation}</span>
              {leg2.fromCode && <span className="text-xs text-zinc-600">({leg2.fromCode})</span>}
              <span className="text-zinc-600" aria-hidden="true">→</span>
              <span className="text-zinc-300">{leg2.toStation}</span>
              {leg2.toCode && <span className="text-xs text-zinc-600">({leg2.toCode})</span>}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-zinc-500">
              <span>{leg2.departure} – {leg2.arrival}</span>
              <span>{leg2.durationHours} hrs</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold"><span className="text-emerald-500/60">₹</span>{leg2.price.toLocaleString("en-IN")}</span>
              <span className={reliabilityColor[leg2.reliability] || "text-zinc-500"}>{leg2.reliability}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/5 pt-3">
          <span className="text-xs text-zinc-400">Total: ~{journey.totalDuration} hrs + layover</span>
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg text-sm font-semibold">
            <span className="text-emerald-500/60 text-xs">₹</span>{journey.totalPrice.toLocaleString("en-IN")}
            <span className="text-emerald-500/40 text-[10px] font-normal">combined</span>
          </span>
        </div>

        {reason && (
          <div className="mt-3 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-sm text-zinc-300">
            <strong className="text-indigo-400 text-xs uppercase tracking-wide">Why this option?</strong>
            <p className="mt-1 text-zinc-400">{reason.reason || reason}</p>
          </div>
        )}

        {reason?.notes && reason.notes.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <strong className="text-[10px] text-zinc-500 uppercase tracking-wider">Extra Info</strong>
            <ul className="text-sm text-zinc-400 space-y-1" aria-label="Additional notes">
              {reason.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5 shrink-0" aria-hidden="true">-</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      className="rounded-xl border border-white/10 bg-[#13131a] p-4 sm:p-5 hover:border-white/20 transition-all"
      aria-label={`${journey.train} — rank ${rank || ""}`}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {rank && (
            <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0" aria-label={`Rank ${rank}`}>
              {rank}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100">{journey.train}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
            {journey.comfort}
          </span>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saved || saving}
              aria-label={saved ? `${journey.train} saved` : `Save ${journey.train}`}
              className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                saved
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : saveError
                  ? "bg-red-500/15 text-red-400 border border-red-500/20"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:border-indigo-500/30"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {saving ? "Saving..." : saved ? "Saved" : saveError ? "Retry" : "Save"}
            </button>
          )}
        </div>
      </div>

      {(journey.fromStation || journey.toStation) && (
        <div className="mt-2 text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-zinc-300">{journey.fromStation}</span>
            {journey.fromCode && <span className="text-xs text-zinc-600">({journey.fromCode})</span>}
            <span className="text-zinc-600" aria-hidden="true">→</span>
            <span className="text-zinc-300">{journey.toStation}</span>
            {journey.toCode && <span className="text-xs text-zinc-600">({journey.toCode})</span>}
          </div>
        </div>
      )}

      {(journey.departure || journey.arrival) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-zinc-500">
          {journey.departure && <span>Departs: <strong className="text-zinc-300">{journey.departure}</strong></span>}
          {journey.arrival && <span>Arrives: <strong className="text-zinc-300">{journey.arrival}</strong></span>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
        <span className="text-sm text-zinc-500">{journey.durationHours} hrs</span>
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg text-sm font-semibold">
          <span className="text-emerald-500/60 text-xs">₹</span>{journey.price.toLocaleString("en-IN")}
        </span>
        {journey.reliability && (
          <span className={`text-sm ${reliabilityColor[journey.reliability] || "text-zinc-500"}`}>
            {journey.reliability} reliability
          </span>
        )}
      </div>

      {reason && (
        <div className="mt-3 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-sm">
          <strong className="text-indigo-400 text-xs uppercase tracking-wide">Why this option?</strong>
          <p className="mt-1 text-zinc-400">{reason.reason || reason}</p>
        </div>
      )}

      {reason?.notes && reason.notes.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <strong className="text-[10px] text-zinc-500 uppercase tracking-wider">Extra Info</strong>
          <ul className="text-sm text-zinc-400 space-y-1" aria-label="Additional notes">
            {reason.notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5 shrink-0" aria-hidden="true">-</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
