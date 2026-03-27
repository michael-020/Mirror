"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

export default function NotFound() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleCreateWebsite = () => {
    if (session) {
      router.push("/chat");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <main className="h-screen overflow-y-auto custom-scrollbar bg-white dark:bg-[#080810] flex flex-col relative">
        {/* Background effects - matching the landing page */}
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

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            {/* 404 Number */}
            <motion.div
              variants={fadeUp}
              custom={0.1}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-purple-400/20 to-purple-600/20 rounded-3xl blur-2xl" />
                <h1 
                  className="relative text-[8rem] md:text-[12rem] font-black tracking-tight text-black dark:text-white leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  404
                </h1>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.h2
              variants={fadeUp}
              custom={0.2}
              className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Page not found
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Oops! The page you&apos;re looking for seems to have vanished into the digital void.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-lg shadow-black/10"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-black dark:text-white rounded-xl font-medium hover:bg-white/20 dark:hover:bg-black/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              variants={fadeUp}
              custom={0.5}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleCreateWebsite}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Search className="w-3 h-3" />
                  Create a new website
                </button>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <a
                  href="/signin"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Sign in to your account
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer - matching the landing page */}
        <footer className="relative z-10 border-t bg-white/70 border-neutral-200 dark:border-white/[0.06] dark:bg-black/20 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black dark:text-white tracking-tight">Zap</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Google Font import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        `}</style>
      </main>
    </>
  );
}
