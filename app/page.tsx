"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/auth-modal";
import { useAuthStore } from "@/stores/authStore/useAuthStore";
import { PromptInputPanel } from "@/components/prompt-input-panel";
import { showErrorToast } from "@/lib/toast";
import { motion, cubicBezier } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1), delay },
  }),
};

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "Instant generation",
    desc: "From idea to live website in seconds",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    label: "No code needed",
    desc: "Just describe what you want",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    label: "Beautiful designs",
    desc: "Stunning layouts crafted automatically",
  },
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
      <main className="h-screen overflow-y-auto custom-scrollbar bg-white dark:bg-[#080810] flex flex-col relative">
        {/* Background effects */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/* Primary glow */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-purple-600/20 via-purple-800/10 to-transparent rounded-full blur-[120px]" />
          {/* Secondary accent */}
          <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-purple-400 dark:bg-purple-700/8 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-purple-300 dark:bg-purple-500/8 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial fade over grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#fafafa_100%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#080810_100%)]" />
        </div>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto backdrop-blur-2xl bg-white/50 border-neutral-200 dark:bg-white/[0.04] border dark:border-white/[0.08] rounded-2xl px-5"
            >
              <div className="flex items-center justify-between h-14">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-black dark:text-white tracking-tight">Zap</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/signin")}
                    className="text-sm font-medium text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors px-3 py-1.5"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-black text-neutral-100 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all shadow-lg shadow-white/10"
                  >
                    Get started
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </nav>

        {/* Hero - Desktop */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center px-6 pt-[7.3rem] pb-16 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center mb-10 max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeUp}
              custom={0.1}
              className="text-6xl md:text-7xl font-black tracking-tight text-black dark:text-white leading-[1.05] mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Start with a sentence.
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              custom={0.2}
              className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] relative"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                End with a website.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-neutral-600 dark:text-neutral-400 text-xl mt-7 mb-2 leading-relaxed max-w-2xl mx-auto"
            >
              Create stunning websites by chatting with Zap.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={0.38}
              className="text-neutral-500 dark:text-neutral-500 text-base max-w-xl mx-auto"
            >
              No code required. Just describe what you want and watch it come to life.
            </motion.p>
          </motion.div>

          {/* Input box */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative">
              {/* Glow behind input */}
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/40 via-purple-400/40 to-purple-600/40 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.05] backdrop-blur-2xl rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl shadow-neutral-200 dark:shadow-black/50 ring-1 ring-white/[0.05]">
                <PromptInputPanel
                  isPremium={false}
                  description={prompt}
                  setDescription={setPrompt}
                  onSubmit={handleSubmit}
                  isSubmitting={false}
                  disabled={false}
                  placeholder="Describe the website you want to build..."
                  textareaHeight="6rem"
                  textareaMaxHeight="16rem"
                  maxImages={10}
                  showSupportModal={false}
                />
              </div>
            </div>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center justify-center gap-6 mt-6"
            >
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-black dark:text-neutral-500">
                  <span className="text-purple-400">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Hero - Mobile */}
        <div className="md:hidden flex flex-col min-h-full relative z-10">
          <div className="flex-1 px-5 pt-56 pb-6">
            <motion.div initial="hidden" animate="visible" className="text-center mb-8 max-w-2xl mx-auto">

              <motion.h1
                variants={fadeUp}
                custom={0.1}
                className="text-[2rem] font-black tracking-tight text-black dark:text-white leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Start with a sentence.
              </motion.h1>
              <motion.h2
                variants={fadeUp}
                custom={0.2}
                className="text-[2rem] font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent mt-1 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                End with a website.
              </motion.h2>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.3} initial="hidden" animate="visible" className="text-neutral-400 text-center mb-2 text-sm leading-relaxed max-w-md mx-auto">
              Create stunning websites by chatting with Zap.
            </motion.p>
            <motion.p variants={fadeUp} custom={0.38} initial="hidden" animate="visible" className="text-neutral-500 text-center text-xs max-w-sm mx-auto mb-10">
              No code required. Just describe what you want.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 pb-4"
          >
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/40 via-purple-400/30 to-purple-600/40 rounded-2xl blur-xl opacity-40" />
              <div className="relative bg-white/[0.05] backdrop-blur-2xl rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl shadow-neutral-200 dark:shadow-black/50">
                <PromptInputPanel
                  isPremium={false}
                  description={prompt}
                  setDescription={setPrompt}
                  onSubmit={handleSubmit}
                  isSubmitting={false}
                  disabled={false}
                  placeholder="Describe the website you want to build..."
                  textareaHeight="4rem"
                  textareaMaxHeight="12rem"
                  maxImages={10}
                  showSupportModal={false}
                  // textareaClassName="text-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Footer mobile */}
          <footer className="border-t bg-white/70 border-neutral-200 dark:border-white/[0.06] dark:bg-black/20 backdrop-blur-xl mt-4">
            <div className="px-4 py-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-black dark:text-white tracking-tight">Zap</span>
                </div>
                <p className="text-xs text-neutral-600">© 2026 Zap. All rights reserved.</p>
                <div className="flex items-center gap-8">
                  <a href="/policies" className="text-sm font-medium text-black hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-white transition-colors duration-200">
                    Policies
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-black hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Footer - Desktop */}
        <footer className="hidden md:block relative z-10 border-t bg-white/70 border-neutral-200 dark:border-white/[0.06] dark:bg-black/20 backdrop-blur-xl mt-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-black dark:text-white tracking-tight">Zap</span>
                </div>
                <span className="dark:text-neutral-700">·</span>
                <p className="text-sm text-black dark:text-neutral-600">© 2026 Zap. All rights reserved.</p>
              </div>

              <div className="flex items-center gap-8">
                <a href="/policies" className="text-sm font-medium text-black hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-white transition-colors duration-200">
                  Policies
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-black hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Google Font import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        `}</style>
      </main>
    </>
  );
}