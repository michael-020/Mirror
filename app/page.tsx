"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/auth-modal";
import { useAuthStore } from "@/stores/authStore/useAuthStore";
import { PromptInputPanel } from "@/components/prompt-input-panel";
import { showErrorToast } from "@/lib/toast";

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
      <main className="h-screen overflow-y-auto custom-scrollbar bg-neutral-50 dark:bg-neutral-950 flex flex-col relative">
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-3xl rounded-full mt-[-200px]" />
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white select-none">
                Zap
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/signin")}
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </button>

                <button
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white dark:bg-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow-md"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col pt-16 relative z-10">
          {/* Mobile layout */}
          <div className="md:hidden flex flex-col min-h-full">
            <div className="flex-1 px-5 pt-12 pb-6">
              <div className="text-center mb-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  Start with a sentence.
                </h1>
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-1">
                  End with a website.
                </h2>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-3 text-base leading-relaxed max-w-md mx-auto">
                Create stunning websites by chatting with Zap.
              </p>
              
              <p className="text-neutral-500 dark:text-neutral-500 text-center text-sm max-w-sm mx-auto mb-8">
                No code required. Just describe what you want.
              </p>
            </div>

            {/* Input panel */}
            <div className="px-4 pb-4">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden ring-1 ring-neutral-900/5 dark:ring-white/5">
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
                />
              </div>
            </div>

            {/* Footer for mobile */}
            <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl mt-4">
              <div className="px-4 py-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-black text-neutral-900 dark:text-white select-none tracking-tight">
                      Zap
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      © 2026 Zap. All rights reserved.
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <a
                      href="/policies"
                      className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
                    >
                      Policies
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2.5"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden sm:inline">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <div className="hidden md:flex flex-1 flex-col items-center justify-center px-6">
            <div className="text-center mb-8 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                Start with a sentence.
              </h1>
              <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2 relative">
                End with a website.
                <span className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full -z-10" />
              </h2>
            </div>
            
            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-3 text-lg md:text-xl leading-relaxed max-w-2xl">
              Create stunning websites by chatting with Zap.
            </p>
            
            <p className="text-neutral-500 dark:text-neutral-500 text-center text-base mb-16 max-w-xl">
              No code required. Just describe what you want and watch it come to life.
            </p>

            <div className="w-full max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-[1.75rem] blur-xl opacity-60 dark:opacity-40" />
                <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-neutral-200 dark:border-neutral-800 overflow-hidden ring-1 ring-neutral-900/5 dark:ring-white/5 transition-all duration-300 hover:shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
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
              
              {/* Trust indicator */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-neutral-500 dark:text-neutral-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Start building in seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer for desktop only */}
        <footer className="hidden md:block relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex flex-col items-center md:items-start gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white select-none tracking-tight">
                  Zap
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  © 2026 Zap. All rights reserved.
                </p>
              </div>

              <div className="flex items-center gap-8 sm:gap-10">
                <a
                  href="/policies"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
                >
                  Policies
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2.5"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </main>
    </>
  );
}