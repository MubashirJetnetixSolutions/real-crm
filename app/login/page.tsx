"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "../components/UserProfileProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserProfile();
  const [email, setEmail] = useState("admin@estatex.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, remember);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#0f1729] via-[#141d32] to-[#0a1020]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-16 w-72 h-72 bg-primary/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-24 right-12 w-96 h-96 bg-primary-container/30 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="material-symbols-outlined text-on-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                apartment
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-headline-md leading-tight">Estate X</p>
              <p className="text-white/45 text-[11px] uppercase tracking-widest font-medium">Premium Real Estate CRM</p>
            </div>
          </div>

          <div className="max-w-lg">
            <h1 className="text-[2.5rem] xl:text-[3rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
            Manage Properties, Leads & Deals All in One Platform.
            </h1>
            <p className="text-white/55 text-body-lg leading-relaxed mb-10">
            The complete real estate management solution for agencies and brokers. Streamline your workflow, track clients, manage listings, and close more deals with confidence.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "10K+", label: "Properties Managed" },
                { value: "$500M", label: "Deals Processed" },
                { value: "99%", label: "Client Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.06] border border-white/[0.08] p-4 backdrop-blur-sm">
                  <p className="text-white font-bold text-headline-md">{stat.value}</p>
                  <p className="text-white/45 text-body-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-body-sm">© 2026 Estate X. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-on-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                apartment
              </span>
            </div>
            <p className="text-headline-md font-bold text-on-surface">Estate X</p>
          </div>

          <div className="mb-8">
            <h2 className="text-headline-xl font-bold text-on-surface">Welcome back</h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-error text-body-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-label-sm text-on-surface-variant font-medium">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-label-sm text-on-surface-variant font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-11 pr-12 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                />
                <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-body-sm text-primary font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-body-sm text-on-surface-variant mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/contact" className="text-primary font-semibold hover:underline">
              Contact sales
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
