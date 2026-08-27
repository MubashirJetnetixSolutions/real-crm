"use client"
import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "../components/global/Navbar"

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: "Luminary UI",
    desc: "A next-gen design system built for scalability and beauty. Every token, every component handcrafted.",
    tags: ["Design", "React"],
    gradient: "from-indigo-500 to-blue-600",
    year: "2025",
    status: "Live",
  },
  {
    title: "Orbit Dashboard",
    desc: "Real-time analytics dashboard with live data streaming, custom charting, and AI-powered insights.",
    tags: ["Full-Stack", "React"],
    gradient: "from-purple-500 to-pink-600",
    year: "2025",
    status: "Live",
  },
  {
    title: "Pulse Motion",
    desc: "GSAP-powered animation library with 60+ prebuilt cinematic interactions for modern web projects.",
    tags: ["Motion", "Design"],
    gradient: "from-emerald-500 to-teal-600",
    year: "2024",
    status: "Open Source",
  },
  {
    title: "NightWatch",
    desc: "Cybersecurity SaaS platform monitoring threats in real-time with a powerful alerting engine.",
    tags: ["Full-Stack"],
    gradient: "from-rose-500 to-orange-500",
    year: "2024",
    status: "Live",
  },
  {
    title: "Velvet Commerce",
    desc: "Luxury e-commerce experience with cinematic product reveals, micro-interactions, and frictionless UX.",
    tags: ["Motion", "React"],
    gradient: "from-violet-500 to-indigo-600",
    year: "2024",
    status: "Live",
  },
  {
    title: "Stratosphere",
    desc: "3D immersive landing page built with Three.js and WebGL — an environment you can feel.",
    tags: ["Motion", "Design"],
    gradient: "from-sky-400 to-cyan-600",
    year: "2023",
    status: "Case Study",
  },
]

const filters = ["All", "React", "Full-Stack", "Motion", "Design"]

export default function ProjectsPage() {
  const [active, setActive] = useState("All")
  const containerRef = useRef(null)

  const filtered = active === "All" ? projects : projects.filter((p) => p.tags.includes(active))

  useGSAP(() => {
    gsap.fromTo(".proj-hero-text",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.1, ease: "power3.out" }
    )
    gsap.fromTo(".filter-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".filter-row", start: "top 85%" } }
    )
  }, { scope: containerRef })

  // re-animate cards when filter changes
  function handleFilter(f) {
    setActive(f)
    setTimeout(() => {
      gsap.fromTo(".proj-card",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out" }
      )
    }, 0)
  }

  return (
    <div ref={containerRef} className="bg-neutral-950 text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-700/8 blur-[160px]" />

      {/* HERO */}
      <section className="flex flex-col items-start justify-end min-h-screen px-[4vw] pb-[8vw]">
        <div className="proj-hero-text">
          <span className="inline-block text-xs font-semibold tracking-[0.35em] text-purple-400 uppercase mb-8 px-4 py-2 border border-purple-500/30 rounded-full bg-purple-500/10">
            Our Work
          </span>
        </div>
        <h1 className="proj-hero-text text-[clamp(4rem,13vw,12rem)] font-bold leading-[0.9] tracking-tight">
          Selected<br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Projects.</span>
        </h1>
        <p className="proj-hero-text mt-10 max-w-xl text-gray-400 text-lg leading-relaxed">
          A curated showcase of our most impactful work across design, development, and motion.
        </p>
      </section>

      {/* FILTER + CARDS */}
      <section className="px-[4vw] py-[8vw]">
        {/* Filter row */}
        <div className="filter-row flex gap-3 flex-wrap mb-14">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`filter-btn px-6 py-3 rounded-full text-sm font-medium border transition-all duration-300 ${
                active === f
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white bg-white/[0.02]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Big project cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((project, i) => (
            <div
              key={project.title}
              className="proj-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-14 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer"
            >
              {/* bg gradient fill on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-600 rounded-3xl`} />

              {/* top meta row */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-500 bg-white/[0.03]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{project.year}</span>
                  <span className={`px-3 py-1 rounded-full text-xs border border-white/10 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* title */}
              <h2 className={`text-[clamp(2.5rem,7vw,6rem)] font-bold leading-none tracking-tight bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent mb-6`}>
                {project.title}
              </h2>

              {/* desc + arrow */}
              <div className="flex items-end justify-between gap-8">
                <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl group-hover:text-gray-300 transition-colors duration-300">
                  {project.desc}
                </p>
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-xl text-gray-600 group-hover:text-white group-hover:bg-gradient-to-br ${project.gradient} group-hover:border-transparent transition-all duration-400`}>
                  →
                </div>
              </div>

              {/* index */}
              <span className="absolute top-10 right-14 text-[5rem] font-bold text-white/[0.03] font-mono leading-none group-hover:text-white/[0.06] transition-colors duration-500 hidden md:block">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* bottom bar */}
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${project.gradient} transition-all duration-500 group-hover:w-full rounded-full`} />
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
