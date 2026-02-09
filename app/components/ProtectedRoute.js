"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] gap-3" role="status" aria-live="polite">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
        <span className="text-zinc-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
