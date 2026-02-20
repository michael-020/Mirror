"use client"

import Navbar from "@/components/navbar"
import RightSidebar from "@/components/sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const sections = [
  { id: "terms", label: "Terms of Service" },
  { id: "payment", label: "Payment & Subscription" },
  { id: "refund", label: "Refund Policy" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "usage", label: "Usage Limits & Fair Use" },
  { id: "availability", label: "Service Availability" },
  { id: "contact", label: "Contact Us" },
]

const PoliciesPage = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeSection, setActiveSection] = useState("terms")

  const onBackHandler = () => router.push("/chat")

  useEffect(() => {
    const threshold = 25
    const sidebarWidth = 256

    const onMouseMove = (e: MouseEvent) => {
      const isNearRightEdge = window.innerWidth - e.clientX <= threshold
      const isInsideSidebar = e.clientX >= window.innerWidth - sidebarWidth
      if (isNearRightEdge) setIsHovered(true)
      else if (!isInsideSidebar && isHovered) setIsHovered(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    return () => document.removeEventListener("mousemove", onMouseMove)
  }, [isHovered])

  // Intersection observer to highlight active section in index
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const sidebarVisible = isOpen || isHovered

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-[#080810]" id="scroll-container">
      <Navbar
        onBack={onBackHandler}
        showBackButton={true}
        showPanelToggle={true}
        onPanelToggle={() => setIsOpen(!isOpen)}
      />

      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
          <p className="text-neutral-500 text-sm">Last updated: January 22, 2026</p>
        </div>

        <div className="flex gap-10 items-start">
          {/* Left index — sticky */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-8 self-start">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">On this page</p>
            <nav className="flex flex-col gap-1">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === id
                      ? "text-purple-300 bg-purple-500/10 border-l-2 border-purple-400 pl-[10px]"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] border-l-2 border-transparent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">

            <section id="terms" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-white/[0.07] scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Terms of Service</h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <p>By accessing and using Zap, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">1. Service Description</h3>
                  <p>Zap is an AI-powered website generation platform that allows users to create websites through conversational interactions. We provide both free and paid subscription tiers with varying features and usage limits.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">2. User Responsibilities</h3>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to use Zap for any illegal or unauthorized purpose, including but not limited to generating harmful, fraudulent, or misleading content.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">3. Content Ownership</h3>
                  <p>You retain all rights to the content and websites you create using Zap. However, you grant us a limited license to store and process your content to provide our services.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">4. Acceptable Use</h3>
                  <p>You may not use Zap to create content that infringes on intellectual property rights, contains malicious code, promotes illegal activities, or violates any applicable laws or regulations.</p>
                </div>
              </div>
            </section>

            <section id="payment" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-white/[0.07] scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Payment & Subscription Policy</h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">1. Pricing Plans</h3>
                  <p className="mb-3">Zap offers two pricing tiers:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><span className="font-semibold text-neutral-200">Free Plan:</span> Limited to 5 iterations per day, 5 projects per account, 5 downloads per account, and access to our basic AI model.</li>
                    <li><span className="font-semibold text-neutral-200">Pro Plan:</span> One-time payment of ₹99 for lifetime access to unlimited iterations, unlimited projects, unlimited downloads, and our advanced AI model.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">2. Payment Processing</h3>
                  <p>All payments are processed securely through our payment gateway. By providing payment information, you authorize us to charge the specified amount for your chosen plan.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">3. Pro Plan - Lifetime Access</h3>
                  <p>The Pro Plan is a one-time payment that grants you lifetime access to all Pro features. This is not a recurring subscription and you will not be charged again unless you choose to purchase additional services in the future.</p>
                </div>
              </div>
            </section>

            <section id="refund" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-purple-500/20 scroll-mt-28">
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 bg-purple-500/15 rounded-lg shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Refund Policy</h2>
                  <p className="text-purple-400 text-xs font-medium mt-0.5">Important: Please read carefully</p>
                </div>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <div className="bg-purple-500/[0.07] border border-purple-500/20 rounded-xl p-5">
                  <h3 className="font-bold text-neutral-200 mb-2">No Refund Policy</h3>
                  <p className="mb-3"><span className="font-semibold text-neutral-200">All sales of the Pro Plan are final and non-refundable.</span> Once you have completed your purchase and payment has been processed, you will not be eligible for a refund under any circumstances.</p>
                  <p>This policy applies regardless of:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>How much you have used the service</li>
                    <li>Whether you change your mind after purchase</li>
                    <li>Technical issues on your end</li>
                    <li>Any other reason</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">Why No Refunds?</h3>
                  <p>The Pro Plan is offered at a significantly discounted one-time price for lifetime access. Due to the nature of digital services and the immediate access granted upon purchase, we cannot offer refunds. We encourage you to try our Free Plan first to ensure Zap meets your needs before upgrading.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">Try Before You Buy</h3>
                  <p>We strongly recommend using our Free Plan to familiarize yourself with Zap&apos;s features and capabilities before purchasing the Pro Plan. The Free Plan provides 5 iterations per day, which should give you a good understanding of our service.</p>
                </div>
              </div>
            </section>

            <section id="privacy" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-white/[0.07] scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Privacy Policy</h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">1. Data Collection</h3>
                  <p>We collect information you provide directly to us, including your name, email address, payment information, and the content you create using our platform. We also collect usage data to improve our services.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">2. Data Usage</h3>
                  <p>Your data is used to provide and improve our services, process payments, communicate with you, and ensure platform security. We do not sell your personal information to third parties.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">3. Data Security</h3>
                  <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">4. Your Rights</h3>
                  <p>You have the right to access, correct, or delete your personal data. You can also request data portability and object to certain data processing activities. Contact us to exercise these rights.</p>
                </div>
              </div>
            </section>

            <section id="usage" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-white/[0.07] scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Usage Limits & Fair Use</h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <p>While Pro users have access to unlimited iterations and projects, we expect all users to use our service fairly and reasonably. Excessive or abusive use that impacts service quality for other users may result in temporary restrictions or account suspension.</p>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">Examples of Excessive Use:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Automated or bot-driven generation requests</li>
                    <li>Commercial reselling of generated content</li>
                    <li>Intentional system abuse or exploitation</li>
                    <li>Using our service to provide services to third parties</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="availability" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-white/[0.07] scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Service Availability & Changes</h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-400">
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">1. Service Uptime</h3>
                  <p>While we strive to maintain 99.9% uptime, we do not guarantee uninterrupted service. Scheduled maintenance and unexpected outages may occur. We will notify users of planned maintenance when possible.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">2. Feature Changes</h3>
                  <p>We reserve the right to modify, add, or remove features at any time. Pro Plan users will continue to have access to core features, though specific implementations may change as we improve our service.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-200 mb-1.5">3. Service Termination</h3>
                  <p>We reserve the right to terminate or suspend accounts that violate our terms of service. In the event we discontinue our service entirely, we will provide reasonable notice and assistance with data export.</p>
                </div>
              </div>
            </section>

            <section id="contact" className="bg-white/[0.03] rounded-2xl p-6 sm:p-8 border border-purple-500/20 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Contact Us</h2>
              <div className="space-y-3 text-sm sm:text-base text-neutral-400">
                <p>If you have any questions about these policies or need support, please contact us:</p>
                <div className="space-y-2">
                  <p><span className="font-semibold text-neutral-200">Email:</span> zap.ai.help@gmail.com</p>
                  <p><span className="font-semibold text-neutral-200">Response Time:</span> Within 24–48 hours</p>
                </div>
              </div>
            </section>

            <section className="bg-white/[0.02] rounded-2xl p-5 sm:p-6 border border-white/[0.05]">
              <p className="text-sm text-neutral-500 text-center">
                By using Zap, you acknowledge that you have read, understood, and agree to be bound by these policies. If you do not agree with any part of these policies, please do not use our service.
              </p>
            </section>

          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={sidebarVisible}
        setIsOpenAction={handleSidebarClose}
        onMouseLeaveAction={handleSidebarMouseLeave}
      />
    </div>
  )

  function handleSidebarMouseLeave() { setIsHovered(false) }
  function handleSidebarClose() { setIsOpen(false); setIsHovered(false) }
}

export default PoliciesPage