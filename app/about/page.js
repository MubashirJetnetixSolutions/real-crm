"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "../components/global/Navbar"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: "5+",   label: "Years of Experience", gradient: "from-indigo-500 to-blue-500" },
  { value: "120+", label: "Projects Delivered",  gradient: "from-purple-500 to-violet-500" },
  { value: "40+",  label: "Happy Clients",        gradient: "from-pink-500 to-rose-500" },
  { value: "99%",  label: "Satisfaction Rate",    gradient: "from-emerald-500 to-teal-500" },
]

const team = [
  { name: "Alex Carter",  role: "Lead Designer",   initials: "AC", gradient: "from-indigo-500 to-blue-600",   bio: "Turning complex problems into elegant, human-centred interfaces." },
  { name: "Jordan Lee",   role: "Full-Stack Dev",  initials: "JL", gradient: "from-purple-500 to-violet-600", bio: "Architecting scalable systems with a passion for performance." },
  { name: "Sam Rivera",   role: "Motion Artist",   initials: "SR", gradient: "from-pink-500 to-rose-600",     bio: "Bringing brands to life through cinematic motion design." },
]

export default function AboutPage() {
  const containerRef = useRef(null)
  const statsRef     = useRef(null)
  const teamRef      = useRef(null)

  useGSAP(() => {
    gsap.fromTo(".about-hero-text",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.1, ease: "power3.out" }
    )
    gsap.fromTo(".stat-card",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 75%" } }
    )
    gsap.fromTo(".team-card",
      { y: 80, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: teamRef.current, start: "top 75%" } }
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="bg-neutral-950 text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pointer-events-none fixed top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-indigo-700/8 blur-[160px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-700/8 blur-[140px]" />

      {/* HERO */}
      <section className="flex flex-col items-start justify-end min-h-screen px-[4vw] pb-[8vw]">
        <div className="about-hero-text">
          <span className="inline-block text-xs font-semibold tracking-[0.35em] text-indigo-400 uppercase mb-8 px-4 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/10">
            Who We Are
          </span>
        </div>
        <h1 className="about-hero-text text-[clamp(4rem,13vw,12rem)] font-bold leading-[0.9] tracking-tight">
          Built by<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">creators.</span>
        </h1>
        <p className="about-hero-text mt-10 max-w-xl text-gray-400 text-lg leading-relaxed">
          A passionate collective of designers, developers, and storytellers obsessed with crafting digital experiences that leave a lasting impression.
        </p>
      </section>

      {/* STATS BIG CARDS */}
      <section ref={statsRef} className="px-[4vw] py-[8vw]">
        <p className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-10">By the numbers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="stat-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-12 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
              <div className={`text-[clamp(4rem,10vw,8rem)] font-bold leading-none bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent mb-4`}>{s.value}</div>
              <p className="text-gray-500 text-xl group-hover:text-gray-300 transition-colors duration-300">{s.label}</p>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${s.gradient} transition-all duration-500 group-hover:w-full rounded-full`} />
            </div>
          ))}
        </div>
      </section>

      {/* TEAM BIG CARDS */}
      <section ref={teamRef} className="px-[4vw] py-[8vw] border-t border-white/5">
        <p className="text-xs tracking-[0.35em] uppercase text-gray-600 mb-4">The Team</p>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold mb-16 tracking-tight">
          Meet the minds<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">behind the magic.</span>
        </h2>
        <div className="flex flex-col gap-6">
          {team.map((member, i) => (
            <div key={member.name} className="team-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-3xl`} />
              <div className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-3xl md:text-4xl font-bold shadow-2xl`}>{member.initials}</div>
              <div className="flex-1">
                <span className="text-xs tracking-widest uppercase text-gray-600 mb-2 block">{member.role}</span>
                <h3 className={`text-[clamp(2rem,5vw,4rem)] font-bold leading-none tracking-tight bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-4`}>{member.name}</h3>
                <p className="text-gray-500 text-base md:text-lg group-hover:text-gray-300 transition-colors duration-300 max-w-md">{member.bio}</p>
              </div>
              <span className="hidden md:block text-[6rem] font-bold text-white/[0.04] font-mono leading-none group-hover:text-white/[0.07] transition-colors duration-500">0{i + 1}</span>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${member.gradient} transition-all duration-500 group-hover:w-full rounded-full`} />
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 px-[4vw] py-10 flex items-center justify-between text-gray-600 text-sm">
        <span className="font-bold text-white">NEXUS<span className="text-indigo-500">.</span></span>
        <span>© 2025 All rights reserved.</span>
      </footer>
    </div>
  )
}
