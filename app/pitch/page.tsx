"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TOTAL_SLIDES = 12;

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col select-none"
      onClick={next}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === " ") next();
        if (e.key === "ArrowLeft") prev();
      }}
      tabIndex={0}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
          style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      {/* Slide container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl">

          {/* ===== Slide 0: Title ===== */}
          {current === 0 && (
            <div className="text-center space-y-8 animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                Seed Round · 2026
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                Closr
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                The Tesla of Sales.<br />
                We sell the dashcam today.<br />
                We turn on autopilot tomorrow.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-white/40 pt-4">
                <span>AI Sales Copilot</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Coaching Marketplace</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Autonomous Selling</span>
              </div>
            </div>
          )}

          {/* ===== Slide 1: Problem ===== */}
          {current === 1 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">The Problem</p>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                100M salespeople make calls every day.<br />
                <span className="text-white/30">The data disappears when they hang up.</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {[
                  { stat: "100M+", label: "Salespeople globally", sub: "Insurance, Real Estate, B2B, Auto..." },
                  { stat: "0%", label: "Calls analyzed", sub: "Most reps get zero feedback on their calls" },
                  { stat: "$4.1T", label: "Annual sales lost", sub: "Due to poor technique & missed signals" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-3xl font-bold text-violet-400">{item.stat}</p>
                    <p className="text-sm font-medium text-white mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Slide 2: Solution ===== */}
          {current === 2 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">The Solution</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Closr captures every sales conversation<br />
                and turns it into growth.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                    <div>
                      <p className="font-semibold">Upload call or chat</p>
                      <p className="text-sm text-white/50 mt-1">Voice recording, KakaoTalk, email — any sales conversation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                    <div>
                      <p className="font-semibold">AI Copilot analyzes</p>
                      <p className="text-sm text-white/50 mt-1">Closing opportunities, objection handling, talk ratio, tone shifts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                    <div>
                      <p className="font-semibold">Get coached by proven experts</p>
                      <p className="text-sm text-white/50 mt-1">1:1, seminars, cohorts — with data-proven coaching effectiveness</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">72</div>
                  <p className="text-sm text-white/50 mt-2">Your closing score this week</p>
                  <div className="flex gap-2 mt-4">
                    {["Closing: 60", "Tone: 75", "Objection: 78"].map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-white/60">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 3: The Data Moat ===== */}
          {current === 3 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Why Us — Data Moat</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                We collect data that<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">doesn&apos;t exist anywhere else.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  <p className="text-sm font-medium text-white/60">What OpenAI / Google has:</p>
                  <p className="text-white/80">General conversation data, books, internet text</p>
                  <p className="text-sm font-medium text-red-400 mt-4">What they DON&apos;T have:</p>
                  <ul className="text-sm text-white/50 space-y-1">
                    <li>✗ Real sales call recordings with outcomes</li>
                    <li>✗ Success/failure tags per conversation</li>
                    <li>✗ Expert coach feedback on specific calls</li>
                    <li>✗ Before/after coaching effectiveness data</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl p-6 border border-violet-500/20 space-y-4">
                  <p className="text-sm font-medium text-violet-400">What Closr has:</p>
                  <ul className="text-sm text-white/80 space-y-2">
                    <li>✓ Real sales conversations (voice + text)</li>
                    <li>✓ Tagged with deal outcome (won / lost / pending)</li>
                    <li>✓ AI analysis scores per conversation</li>
                    <li>✓ Expert coach commentary &amp; feedback</li>
                    <li>✓ Before/after coaching score deltas</li>
                    <li>✓ Multi-language, multi-industry</li>
                  </ul>
                  <p className="text-xs text-violet-400/60 pt-2">Every conversation makes the AI smarter. Competitors can&apos;t replicate this.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 4: Tesla Analogy ===== */}
          {current === 4 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">The Roadmap</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Tesla sold cameras before autopilot.<br />
                <span className="text-white/30">We sell the dashcam for sales.</span>
              </h2>
              <div className="space-y-4 pt-4">
                {[
                  { phase: "Now", label: "Dashcam Review", desc: "Post-call AI analysis + coaching marketplace", color: "from-violet-500 to-violet-600", active: true },
                  { phase: "v1-2", label: "Assisted Driving", desc: "Real-time coaching during calls — live prompts, emotion gauge", color: "from-violet-500/50 to-blue-500/50", active: false },
                  { phase: "v3+", label: "Semi-Autonomous", desc: "AI handles follow-ups, cold texts, simple calls", color: "from-blue-500/30 to-blue-600/30", active: false },
                  { phase: "v4+", label: "Full Self-Driving", desc: "AI sells autonomously. Your voice, your style, 24/7", color: "from-blue-500/20 to-blue-600/20", active: false },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-6 rounded-2xl p-6 border transition-all",
                    item.active ? "bg-gradient-to-r border-violet-500/30" : "bg-white/[0.02] border-white/5",
                    `bg-gradient-to-r ${item.color}`
                  )}>
                    <div className={cn(
                      "text-sm font-bold w-16 shrink-0",
                      item.active ? "text-violet-400" : "text-white/30"
                    )}>{item.phase}</div>
                    <div>
                      <p className={cn("font-semibold", item.active ? "text-white" : "text-white/50")}>{item.label}</p>
                      <p className={cn("text-sm mt-0.5", item.active ? "text-white/70" : "text-white/30")}>{item.desc}</p>
                    </div>
                    {item.active && <span className="ml-auto text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300">We are here</span>}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/30 text-center pt-4">
                Each phase generates revenue AND data for the next phase.
              </p>
            </div>
          )}

          {/* ===== Slide 5: Market ===== */}
          {current === 5 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Market Opportunity</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                $200B+ Total Addressable Market
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { tam: "$5B", label: "Sales Coaching", desc: "Where we start. Coaching marketplace + AI copilot.", tag: "Now" },
                  { tam: "$30B", label: "Sales Automation", desc: "AI sales bots marketplace. Companies hire bots, not reps.", tag: "Year 3-4" },
                  { tam: "$170B+", label: "CRM Replacement", desc: "Auto-filling CRM built from actual conversations. Salesforce killer.", tag: "Year 5+" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col">
                    <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 w-fit">{item.tag}</span>
                    <p className="text-4xl font-bold text-white mt-4">{item.tam}</p>
                    <p className="text-sm font-medium text-white mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-2 flex-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/30 text-sm">
                Salesforce market cap: $300B. We&apos;re building the AI-native replacement.
              </p>
            </div>
          )}

          {/* ===== Slide 6: Business Model ===== */}
          {current === 6 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Business Model</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                The tool is free.<br />
                <span className="text-white/30">The money is in people &amp; AI.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-white/60 font-medium">Revenue Streams</p>
                  {[
                    { source: "Cohort Education", rate: "20-25%", example: "4-week bootcamp, 10 people × $200", primary: true },
                    { source: "1:1 Coaching", rate: "20%", example: "Per session, $30-100", primary: true },
                    { source: "Seminars", rate: "20%", example: "Online webinar, $15-40/ticket", primary: false },
                    { source: "Influencer Subscriptions", rate: "20%", example: "Monthly $10/follower", primary: false },
                    { source: "Enterprise (B2B)", rate: "Annual license", example: "Team coaching dashboard", primary: false },
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between rounded-xl p-4 border",
                      item.primary ? "bg-violet-500/10 border-violet-500/20" : "bg-white/[0.02] border-white/5"
                    )}>
                      <div>
                        <p className="text-sm font-medium">{item.source}</p>
                        <p className="text-xs text-white/40 mt-0.5">{item.example}</p>
                      </div>
                      <span className="text-sm font-bold text-violet-400">{item.rate}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-sm text-white/60 font-medium mb-6">Why NOT SaaS?</p>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <span className="text-red-400">✗</span>
                      <p className="text-white/60">AI costs → $0 in 3 years. SaaS pricing collapses.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-red-400">✗</span>
                      <p className="text-white/60">Competitor offers same tool for free. Game over.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">People can&apos;t be free. Coaching is human-powered.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">Platform take-rate scales with GMV, not users.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">Coach can&apos;t leave — data, reviews, followers are here.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 7: Secret Weapon ===== */}
          {current === 7 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Secret Weapon</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Data-proven coaching.<br />
                <span className="text-white/30">No one else can do this.</span>
              </h2>
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-lg font-bold">K</div>
                  <div>
                    <p className="font-semibold">Coach Kim · Insurance · 12 years</p>
                    <p className="text-sm text-white/50">48 reviews · ⭐ 4.9</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">+23</p>
                    <p className="text-xs text-white/40 mt-1">Avg. score increase</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-violet-400">89%</p>
                    <p className="text-xs text-white/40 mt-1">Students improved</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">4.2x</p>
                    <p className="text-xs text-white/40 mt-1">ROI on coaching fee</p>
                  </div>
                </div>
                <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                  <p className="text-xs text-violet-400 font-medium mb-2">Verified by Closr AI</p>
                  <p className="text-sm text-white/70">
                    &quot;After 4 sessions with Coach Kim, my closing score went from 52 → 78.
                    Objection handling improved by 31 points.&quot;
                  </p>
                  <p className="text-xs text-white/30 mt-2">— Automated score comparison, not self-reported</p>
                </div>
              </div>
              <p className="text-center text-sm text-white/30">
                Every other coaching platform relies on testimonials. We have data.
              </p>
            </div>
          )}

          {/* ===== Slide 8: The Endgame ===== */}
          {current === 8 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">The Endgame</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                AI bots that sell.<br />
                A marketplace where you hire them.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  {[
                    { icon: "🤖", title: "AI Sales Bots", desc: "Trained on top performers' actual call data. Your voice, your style, but 24/7." },
                    { icon: "📊", title: "Bot Leaderboard", desc: "Bots compete on close rate, response time, customer satisfaction. Hire the best one." },
                    { icon: "💬", title: "Undetectable Chat Bots", desc: "Text-based sales bots that handle KakaoTalk, SMS, email. Customers can't tell." },
                    { icon: "📱", title: "Auto CRM", desc: "Every conversation auto-fills the pipeline. No manual entry. Ever." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl p-8 border border-violet-500/20 flex flex-col justify-center">
                  <p className="text-sm text-white/60 mb-4">Today vs. Tomorrow</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/50">Company hires 10 sales reps</span>
                      <span className="text-white/30">$500K/yr</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-violet-400 font-medium">Company hires 100 AI bots</span>
                      <span className="text-violet-400 font-medium">$50K/yr</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/30 mt-6">10x coverage. 1/10th cost. Never sick. Never quits.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 9: Competition ===== */}
          {current === 9 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Competition</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Gong is for enterprises.<br />
                <span className="text-white/30">We&apos;re for everyone else.</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-left">
                      <th className="py-3 pr-4"></th>
                      <th className="py-3 px-4">Gong / Chorus</th>
                      <th className="py-3 px-4">Skool</th>
                      <th className="py-3 px-4 text-violet-400">Closr</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {[
                      ["Target", "Enterprise sales teams", "General communities", "Individual salespeople"],
                      ["Price", "$50K+/year", "$99/mo (creator)", "Free tool + coaching %"],
                      ["AI Analysis", "✓ Call recording", "✗", "✓ Voice + Text + Coaching"],
                      ["Coaching", "✗", "Courses only", "✓ 1:1 + Cohort + Seminar"],
                      ["Data-proven results", "✗", "✗", "✓ Auto score comparison"],
                      ["Individual users", "✗", "✓", "✓"],
                      ["Path to AI selling", "Maybe", "✗", "✓ Core roadmap"],
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3 pr-4 text-white/40 text-xs">{row[0]}</td>
                        <td className="py-3 px-4">{row[1]}</td>
                        <td className="py-3 px-4">{row[2]}</td>
                        <td className="py-3 px-4 text-violet-400 font-medium">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== Slide 10: Traction & Roadmap ===== */}
          {current === 10 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">Roadmap</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Korea first. Then the world.
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { year: "2026", title: "Korea MVP", items: ["AI Copilot (voice + text)", "Coaching marketplace launch", "30 coaches, 5K users", "First cohort revenue"], highlight: true },
                  { year: "2027", title: "Korea Dominance", items: ["50K users, 200 coaches", "Enterprise pilot (10 companies)", "Series A ($3-5M)", "Monthly revenue $300K"], highlight: false },
                  { year: "2028", title: "Global Expansion", items: ["Southeast Asia + Japan", "English copilot launch", "100K+ users globally", "Series B ($15-30M)"], highlight: false },
                  { year: "2029+", title: "AI Autonomous", items: ["AI Sales Bots marketplace", "Auto-CRM launch", "1M+ users", "Series C → $1B+ valuation"], highlight: false },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "rounded-2xl p-6 border flex flex-col",
                    item.highlight ? "bg-violet-500/10 border-violet-500/20" : "bg-white/[0.02] border-white/5"
                  )}>
                    <p className={cn("text-sm font-bold", item.highlight ? "text-violet-400" : "text-white/40")}>{item.year}</p>
                    <p className="font-semibold mt-1">{item.title}</p>
                    <ul className="mt-3 space-y-1.5 flex-1">
                      {item.items.map((li, j) => (
                        <li key={j} className="text-xs text-white/50 flex items-start gap-2">
                          <span className="text-white/20 mt-0.5">→</span> {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Slide 11: The Ask ===== */}
          {current === 11 && (
            <div className="text-center space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">The Ask</p>
              <h2 className="text-5xl md:text-7xl font-bold">
                Seed Round
              </h2>
              <div className="inline-flex items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">$2M</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
                {[
                  { pct: "40%", label: "Product", desc: "AI copilot, coaching platform, global i18n" },
                  { pct: "35%", label: "Growth", desc: "Korea market: 30 coaches, 5K users, first revenue" },
                  { pct: "25%", label: "Global Prep", desc: "English/Japanese launch, STT multi-language, team" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                    <p className="text-3xl font-bold text-violet-400">{item.pct}</p>
                    <p className="text-sm font-medium mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 space-y-3">
                <p className="text-xl font-bold">
                  We&apos;re building the operating system for sales.
                </p>
                <p className="text-white/40">
                  The data moat starts now. Every day without Closr is data lost forever.
                </p>
              </div>
              <p className="text-sm text-white/20 pt-8">
                closr.ai · hello@closr.ai
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className={cn("w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition", current === 0 && "opacity-30 pointer-events-none")}
        >
          ←
        </button>
        <span className="text-xs text-white/30 tabular-nums">{current + 1} / {TOTAL_SLIDES}</span>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className={cn("w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition", current === TOTAL_SLIDES - 1 && "opacity-30 pointer-events-none")}
        >
          →
        </button>
      </div>
    </div>
  );
}
