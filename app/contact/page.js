"use client"
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Navbar from "../components/global/Navbar"

const contactCards = [
  { label: "Email",        value: "hello@nexus.studio",  icon: "✉",  gradient: "from-indigo-500 to-blue-600",  desc: "Drop us a line anytime." },
  { label: "Location",     value: "San Francisco, CA",    icon: "◎",  gradient: "from-purple-500 to-violet-600", desc: "Based on the west coast." },
  { label: "Availability", value: "Open to projects",     icon: "◉",  gradient: "from-emerald-500 to-teal-600", desc: "Accepting new clients Q3 2025." },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const containerRef = useRef(null)
  const formRef      = useRef(null)

  useGSAP(() => {
    gsap.fromTo(".contact-hero-text",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.1, ease: "power3.out" }
    )
    gsap.fromTo(".info-card",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".info-row", start: "top 80%" } }
    )
    gsap.fromTo(".form-card",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" } }
    )
  }, { scope: containerRef })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div ref={containerRef} className="bg-neutral-950 text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pointer-events-none fixed top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-700/8 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-700/8 blur-[120px]" />

      {/* HERO */}
      <section className="flex flex-col items-start justify-end min-h-screen px-[4vw] pb-[8vw]">
        <div className="contact-hero-text">
          <span className="inline-block text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase mb-8 px-4 py-2 border border-pink-500/30 rounded-full bg-pink-500/10">
            Get In Touch
          </span>
        </div>
        <h1 className="contact-hero-text text-[clamp(4rem,13vw,12rem)] font-bold leading-[0.9] tracking-tight">
          Let&apos;s<br />
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Connect.</span>
        </h1>
        <p className="contact-hero-text mt-10 max-w-xl text-gray-400 text-lg leading-relaxed">
          Have a project in mind? We&apos;d love to hear about it. We get back to every message within 24 hours.
        </p>
      </section>

      {/* INFO BIG CARDS */}
      <section className="info-row px-[4vw] py-[4vw] flex flex-col gap-6">
        <p className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-4">Find us</p>
        {contactCards.map((card) => (
          <div
            key={card.label}
            className="info-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 rounded-3xl`} />

            {/* icon */}
            <div className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl shadow-2xl`}>
              {card.icon}
            </div>

            {/* text */}
            <div className="flex-1">
              <span className="text-xs tracking-widest uppercase text-gray-600 mb-1 block">{card.label}</span>
              <h3 className={`text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-tight tracking-tight bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}>
                {card.value}
              </h3>
              <p className="text-gray-500 group-hover:text-gray-300 transition-colors duration-300">{card.desc}</p>
            </div>

            <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${card.gradient} transition-all duration-500 group-hover:w-full rounded-full`} />
          </div>
        ))}
      </section>

      {/* FORM CARD */}
      <section ref={formRef} className="px-[4vw] py-[4vw] pb-[8vw]">
        <p className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-6">Send a message</p>
        <div className="form-card relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-600/5 to-indigo-600/5 rounded-3xl" />

          {sent ? (
            <div className="flex flex-col items-center justify-center min-h-[360px] text-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/25">✓</div>
              <h3 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight">Message Sent!</h3>
              <p className="text-gray-400 text-lg max-w-sm">We&apos;ll get back to you within 24 hours. Exciting things ahead!</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }) }}
                className="mt-4 px-8 py-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="name" className="text-xs text-gray-500 uppercase tracking-widest">Name</label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all duration-300 text-base"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-xs text-gray-500 uppercase tracking-widest">Email</label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all duration-300 text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-xs text-gray-500 uppercase tracking-widest">Message</label>
                <textarea
                  id="message" name="message" rows={7} required
                  value={form.message} onChange={handleChange}
                  placeholder="Tell us about your project, your timeline, your vision..."
                  className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all duration-300 text-base resize-none"
                />
              </div>
              <button
                type="submit"
                className="self-start px-12 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg tracking-wide shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 px-[4vw] py-10 flex items-center justify-between text-gray-600 text-sm">
        <span className="font-bold text-white">NEXUS<span className="text-indigo-500">.</span></span>
        <span>© 2025 All rights reserved.</span>
      </footer>
    </div>
  )
}
