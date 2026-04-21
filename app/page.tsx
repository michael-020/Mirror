"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/auth-modal";
import { useAuthStore } from "@/stores/authStore/useAuthStore";
import { PromptInputPanel } from "@/components/prompt-input-panel";
import { showErrorToast } from "@/lib/toast";
import { motion, cubicBezier } from "framer-motion";

const ease = cubicBezier(0.16, 1, 0.3, 1);

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "In-Browser Dev Environment",
    description: "Full coding environment powered by WebContainer technology — no local setup, no installs. Code editor and project management built right in.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Real-time Live Preview",
    description: "See every change reflected instantly as you build. Tight feedback loops mean faster iteration and fewer surprises.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI-Assisted Development",
    description: "Intelligent code generation, smart suggestions, and a built-in chat interface. Describe what you need — Zap builds it.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud Asset Management",
    description: "Upload, manage, and host images and media assets via Cloudinary. Your content lives in the cloud, always available.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Auth & Project Management",
    description: "Sign in with Google via NextAuth.js. Your projects are saved and secured — pick up right where you left off.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Integrated Payments",
    description: "Built-in Razorpay payment processing with JWT-secured transactions, ready for premium features and subscriptions.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Describe your site",
    body: "Type what you want in plain English — a portfolio, a landing page, a dashboard. The more detail, the better.",
  },
  {
    number: "02",
    title: "Zap builds it",
    body: "Our AI generates a fully structured, styled website in seconds using an in-browser WebContainer environment.",
  },
  {
    number: "03",
    title: "Refine with chat",
    body: "Not quite right? Chat with Zap to tweak layouts, swap colors, add sections — no code required.",
  },
  {
    number: "04",
    title: "Ship it",
    body: "Download your project and deploy it anywhere you like. Your site is ready for the world.",
  }
];

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { setSavedPrompt, setSavedImages } = useAuthStore();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = (description: string, files: File[]) => {
    if (!description.trim()) {
      showErrorToast("Please enter a description");
      return;
    }
    setSavedPrompt(description);
    setSavedImages(files);
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    router.push("/chat");
  };

  return (
    <>
      <main
        className="bg-[#06060f] text-white flex flex-col relative max-h-screen overflow-auto scrollbar-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Global ambient background ── */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[560px] bg-purple-700/18 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] left-[-8%] w-[420px] h-[420px] bg-purple-900/12 rounded-full blur-[110px]" />
          <div className="absolute top-[20%] right-[-8%] w-[360px] h-[360px] bg-violet-800/10 rounded-full blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(139,92,246,1) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,transparent_25%,#06060f_85%)]" />
        </div>

        {/* ══════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════ */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#06060f]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-14">
            <div className="text-neutral-900 dark:text-white font-bold font-stretch-extra-expanded text-base sm:text-xl tracking-wide select-none">
              <div className='flex items-center justify-center gap-2'>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Zap
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push("/signin")}
                className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.06]"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 transition-all"
              >
                Get started
              </button>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════
            HERO — full viewport height
        ══════════════════════════════════════════ */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 pt-14">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease }}
            className="mb-7"
          >
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/[0.08]">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-medium text-purple-300 tracking-wide">
                AI-powered website builder
              </span>
            </div> */}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease }}
            className="text-center font-bold tracking-[-0.03em] leading-[1.07] mb-5 max-w-2xl"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}
          >
            Build websites with{" "}
            <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              just words.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-neutral-400 text-[1.05rem] text-center leading-relaxed max-w-md mb-10"
          >
            Describe what you want. Zap turns your ideas into a real, fully styled website, no code needed.
          </motion.p>

          {/* Prompt input */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600/45 via-violet-500/35 to-purple-600/45 rounded-2xl blur-lg opacity-55" />
              <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.09] shadow-2xl shadow-black/60 ring-1 ring-white/[0.04]">
                <PromptInputPanel
                  isPremium={false}
                  description={prompt}
                  setDescription={setPrompt}
                  onSubmit={handleSubmit}
                  isSubmitting={false}
                  disabled={false}
                  placeholder="Describe the website you want to build..."
                  textareaHeight="5.5rem"
                  textareaMaxHeight="14rem"
                  maxImages={10}
                  showSupportModal={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <span className="text-[11px] text-neutral-600 tracking-widest uppercase">Explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
                Everything you need
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] text-white">
                A complete toolkit, zero setup
              </h2>
              <p className="mt-4 text-neutral-500 max-w-md mx-auto text-[0.95rem] leading-relaxed">
                Zap bundles every tool you need to go from idea to deployed site, in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl border border-white/[0.06]">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="group relative bg-[#06060f] p-7 hover:bg-white/[0.025] transition-colors duration-300"
                >
                  <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-purple-300 mb-4 group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.08] transition-colors duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-[0.95rem] font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-[0.85rem] text-neutral-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-5 border-t border-white/[0.05]">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700/10 rounded-full blur-[100px]" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
                How it works
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] text-white">
                From idea to site in minutes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <div key={i} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(100%_-_12px)] w-[calc(100%_-_24px)] h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
                  )}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 h-full hover:border-purple-500/25 hover:bg-white/[0.05] transition-all duration-300">
                    <span className="text-[0.7rem] font-bold tracking-[0.18em] text-purple-500/70 uppercase">
                      {s.number}
                    </span>
                    <h3 className="text-[0.95rem] font-semibold text-white mt-3 mb-2">{s.title}</h3>
                    <p className="text-[0.83rem] text-neutral-500 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TECH STACK STRIP
        ══════════════════════════════════════════ */}
        <section className="relative z-10 border-t border-white/[0.05] py-14 px-5">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-8">
              Built on
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {["Next.js", "React", "WebContainer", "NextAuth.js", "Cloudinary", "Razorpay"].map((tech) => (
                <span
                  key={tech}
                  className="text-[0.82rem] font-medium text-neutral-600 hover:text-neutral-300 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA
        ══════════════════════════════════════════ */}
        <section className="relative z-10 py-28 px-5 border-t border-white/[0.05]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[300px] bg-purple-700/12 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-2xl mx-auto text-center relative">
            <h2 className="text-3xl md:text-[2.6rem] font-bold tracking-[-0.025em] leading-[1.1] mb-4">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                extraordinary?
              </span>
            </h2>
            <p className="text-neutral-500 text-[0.95rem] leading-relaxed mb-8">
              Start for free. No credit card required. Your first project is just a description away.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-all shadow-lg shadow-white/5"
            >
              Get started free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer className="relative z-10 border-t border-white/[0.06] bg-black/20 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-400 to-violet-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-tight">Zap</span>
              </div>
              <span className="text-neutral-700 hidden md:inline">·</span>
              <p className="text-xs text-neutral-600 hidden md:inline">© 2026 Zap. All rights reserved.</p>
            </div>
            <p className="text-xs text-neutral-600 md:hidden">© 2026 Zap. All rights reserved.</p>
            <div className="flex items-center gap-6 text-[13px]">
              <a href="/policies" className="text-neutral-500 hover:text-white transition-colors">
                Policies
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        `}</style>
      </main>
    </>
  );
}