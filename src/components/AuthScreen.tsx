import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthScreen: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (isSignUp && !agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) setError(error.message);
      else setMessage("Check your email for the confirmation link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0f] text-slate-100 p-4 relative overflow-hidden">
      {/* Background glowing ambient light effects */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -top-32 -left-32"></div>
      <div className="absolute w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -bottom-32 -right-32"></div>

      <div className="max-w-md w-full bg-[#12141c]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase">
            DoN — Diary of a Nerd
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp ? "Set up your secure student workspace" : "Sign in to access your study notes and AI assistant"}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}
        {message && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                placeholder="Alex Johnson"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="student@mku.ac.ke"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••••••"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input 
                type="password" 
                required
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                placeholder="••••••••••••"
              />
            </div>
          )}

          {!isSignUp ? (
            <div className="flex items-center justify-between text-xs text-slate-400 py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset is managed via Supabase."); }} className="hover:text-indigo-400 transition">
                Forgot password?
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
              <input 
                type="checkbox" 
                required
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-white/10 bg-black/40 text-indigo-600 focus:ring-indigo-500"
              />
              <span>I agree to the <span className="text-indigo-400 underline cursor-pointer">Terms & Privacy Policy</span></span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : isSignUp ? "Create Account →" : "Sign In →"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative px-3 bg-[#12141c] text-[10px] tracking-widest uppercase text-slate-500 font-semibold">Or continue with</span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition"
          >
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin("apple")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition"
          >
            Apple
          </button>
        </div>

        {/* Switch Mode Footer */}
        <div className="text-center text-xs text-slate-400">
          {isSignUp ? (
            <span>Already have an account? <button onClick={() => setIsSignUp(false)} className="text-indigo-400 hover:underline font-semibold ml-1">Sign In</button></span>
          ) : (
            <span>Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-indigo-400 hover:underline font-semibold ml-1">Sign Up</button></span>
          )}
        </div>

      </div>
    </div>
  );
};
