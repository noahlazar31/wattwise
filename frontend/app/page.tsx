import Link from "next/link";
import { Upload, Sparkles, TrendingDown } from "lucide-react";

/* ── Design tokens (mirrored from CSS for inline use) ── */
const A = "#F5A623";   // accent amber
const AH = "#E09415";  // accent hover
const DARK = "#111111";
const MUTED = "#6B7280";
const SURFACE = "#F7F7F5";

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: "#FEF3C7", color: A }}
          >
            ⚡
          </span>
          <span className="text-sm font-bold tracking-tight" style={{ color: DARK }}>
            WattWise
          </span>
        </Link>

        {/* Center link */}
        <a
          href="#how-it-works"
          className="hidden text-sm font-medium transition-colors duration-150 hover:text-gray-900 sm:block"
          style={{ color: MUTED }}
        >
          How it works
        </a>

        {/* CTA */}
        <Link
          href="/upload"
          className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 hover:scale-105"
          style={{ background: A, color: DARK }}
        >
          Try it free →
        </Link>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Badge */}
      <div
        className="fade-up fade-up-1 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
        style={{
          background: "#FEF9EE",
          border: `1px solid rgba(245,166,35,0.3)`,
          color: "#92400E",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: A }}
        />
        AI-powered energy analysis
      </div>

      {/* Headline */}
      <h1
        className="fade-up fade-up-2 max-w-3xl font-extrabold leading-[1.08] tracking-tight"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          color: DARK,
        }}
      >
        Find out if you&apos;re
        <br />
        <span style={{ color: A }}>overpaying</span> for energy
      </h1>

      {/* Subtitle */}
      <p
        className="fade-up fade-up-3 mt-5 max-w-xl leading-relaxed"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: MUTED,
        }}
      >
        Upload your utility bill and we&apos;ll instantly compare your rate to the
        national average — no account, no manual entry.
      </p>

      {/* CTA */}
      <div className="fade-up fade-up-4 mt-8">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          style={{
            background: A,
            color: DARK,
            padding: "14px 32px",
            fontSize: "1rem",
            boxShadow: `0 4px 20px rgba(245,166,35,0.35)`,
          }}
        >
          Upload Your Bill
          <span className="text-lg">→</span>
        </Link>
        <p className="mt-3 text-xs" style={{ color: MUTED }}>
          Free · No account required · Results in under 10 seconds
        </p>
      </div>

      {/* Animated upload hint */}
      <div className="fade-up fade-up-5 mt-10 w-full max-w-sm">
        <div
          className="relative rounded-xl p-6 text-center"
          style={{
            background: SURFACE,
          }}
        >
          {/* SVG dashed animated border */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ borderRadius: "12px" }}
          >
            <rect
              x="1" y="1"
              width="calc(100% - 2px)" height="calc(100% - 2px)"
              rx="11" ry="11"
              fill="none"
              stroke={A}
              strokeWidth="1.5"
              className="dash-march"
              style={{ opacity: 0.6 }}
            />
          </svg>

          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "#FEF3C7" }}
          >
            <Upload size={18} style={{ color: A }} />
          </div>
          <p className="text-sm font-medium" style={{ color: DARK }}>
            Drop your bill here
          </p>
          <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
            JPG, PNG, or PDF · max 10 MB
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── How it works ───────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your Bill",
    body: "Drag and drop a photo or PDF of your utility bill. Any format, any provider.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI Analyzes It",
    body: "Claude extracts your usage, cost, and rate plan in seconds — zero manual entry.",
  },
  {
    num: "03",
    icon: TrendingDown,
    title: "See Your Savings",
    body: "Get a clear breakdown showing how your rate stacks up against the $0.16/kWh national average.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24"
      style={{ background: SURFACE }}
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: A }}
          >
            Simple process
          </p>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: DARK }}
          >
            How it works
          </h2>
          <p className="mt-3 text-sm" style={{ color: MUTED }}>
            Three steps from bill to savings — powered by Claude AI.
          </p>
        </div>

        {/* Grid */}
        <div className="relative grid gap-5 sm:grid-cols-3">
          {/* Arrow connectors (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-10 hidden items-center sm:flex">
            <div className="flex-1" />
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-1 items-center justify-center">
                <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
                  <path
                    d="M0 8 L40 8 M34 2 L40 8 L34 14"
                    stroke={A}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.5"
                  />
                </svg>
              </div>
            ))}
            <div className="flex-1" />
          </div>

          {STEPS.map(({ num, icon: Icon, title, body }) => (
            <div
              key={num}
              className="group relative rounded-xl p-7 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                boxShadow: "var(--shadow-card)",
                borderRadius: "var(--radius-card)",
              }}
            >
              {/* Top row */}
              <div className="mb-5 flex items-start justify-between">
                <span
                  className="text-3xl font-black leading-none"
                  style={{ color: A }}
                >
                  {num}
                </span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: SURFACE }}
                >
                  <Icon size={15} style={{ color: MUTED }} />
                </div>
              </div>

              <h3
                className="mb-2 text-base font-bold"
                style={{ color: DARK }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Stats bar ──────────────────────────────────────────── */
const STATS = [
  { value: "$0.16", label: "US average cost per kWh" },
  { value: "~30%", label: "of households overpay vs benchmark" },
  { value: "$400+", label: "average annual overpayment found" },
];

function StatsBar() {
  return (
    <section style={{ background: DARK }} className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 [&>*+*]:border-t [&>*+*]:border-white/8 sm:[&>*+*]:border-t-0 sm:[&>*+*]:border-l sm:[&>*+*]:border-white/8">
          {STATS.map(({ value, label }) => (
            <div key={value} className="py-8 text-center sm:py-0 sm:px-8">
              <p
                className="text-4xl font-black tracking-tight"
                style={{ color: A }}
              >
                {value}
              </p>
              <p
                className="mt-2 text-sm leading-snug"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Sample result teaser card ─────────────────────────── */
function SampleResult() {
  return (
    <div
      className="mx-auto mt-10 w-full max-w-xs rounded-2xl p-5 text-left select-none"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Sample Output
        </p>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold"
          style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5" }}
        >
          ⚠ Overpaying
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Your rate</span>
          <span className="font-bold text-white">$0.21 / kWh</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">US average</span>
          <span className="font-semibold" style={{ color: A }}>$0.16 / kWh</span>
        </div>
        <div
          className="mt-1 h-px w-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Est. annual overpayment</span>
          <span className="font-bold text-red-400">$312</span>
        </div>
      </div>

      {/* Blur overlay to keep it as teaser */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 rounded-b-2xl"
        style={{
          background: "linear-gradient(to top, rgba(17,17,17,0.95), transparent)",
        }}
      />
    </div>
  );
}

/* ── Final CTA ─────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ background: DARK }} className="pb-24 pt-8">
      <div className="mx-auto max-w-2xl px-6 text-center relative">
        <SampleResult />

        <p className="mt-12 text-xs font-semibold uppercase tracking-widest" style={{ color: A }}>
          Ready to find out?
        </p>
        <h2
          className="mt-3 text-3xl font-bold text-white tracking-tight"
        >
          Check your rate in seconds
        </h2>

        {/* Social proof */}
        <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Join 2,000+ households who&apos;ve already checked their energy rate.
        </p>

        <Link
          href="/upload"
          className="mt-8 inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          style={{
            background: A,
            color: DARK,
            padding: "15px 40px",
            fontSize: "1rem",
            boxShadow: `0 4px 24px rgba(245,166,35,0.4)`,
          }}
        >
          Upload Your Bill — It&apos;s Free
          <span className="text-lg">→</span>
        </Link>

        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          No account required · Results in under 10 seconds
        </p>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t py-5"
      style={{
        background: SURFACE,
        borderColor: "rgba(0,0,0,0.07)",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
        <p className="text-xs" style={{ color: MUTED }}>
          © {new Date().getFullYear()} WattWise. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-xs" style={{ color: MUTED }}>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <span>Powered by Claude AI</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: "#FFFFFF", color: DARK }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <StatsBar />
      <FinalCTA />
      <Footer />
    </div>
  );
}
