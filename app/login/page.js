"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      router.push("/");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/user-not-found") setError("No account found. Sign up instead?");
      else if (code === "auth/wrong-password") setError("Incorrect password.");
      else if (code === "auth/email-already-in-use") setError("Email already in use. Try logging in.");
      else if (code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (code === "auth/invalid-email") setError("Invalid email address.");
      else if (code === "auth/invalid-credential") setError("Invalid email or password.");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const anyLoading = loading || googleLoading;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 sm:px-6">
      <div className="bg-[#13131a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">trAI</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {isSignup ? "Create your account" : "Sign in to continue"}
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              disabled={anyLoading}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:text-zinc-600 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              disabled={anyLoading}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:text-zinc-600 transition"
            />
          </div>
          <button
            type="submit"
            disabled={anyLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-5" role="separator">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-sm text-zinc-600">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={anyLoading}
          className="w-full border border-white/10 bg-white/5 text-zinc-300 p-3 rounded-lg font-medium hover:bg-white/10 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <svg className="animate-spin h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-zinc-500 mt-5">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(""); }}
            disabled={anyLoading}
            className="text-indigo-400 font-medium hover:underline focus:outline-none focus:underline disabled:opacity-50"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
}
