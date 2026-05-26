import Link from "next/link";
import { Upload, Sparkles, TrendingDown, BarChart3 } from "lucide-react";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";

const A = "#F5A623";
const DARK = "#111111";
const MUTED = "#6B7280";
const SURFACE = "#F7F7F5";

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
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

        <nav className="hidden items-center gap-6 sm:flex">
          <a href="#features" className="text-sm font-medium transition-colors hover:text-gray-900" style={{ color: MUTED }}>
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-gray-900" style={{ color: MUTED }}>
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link href="/my-bills" className="hidden sm:block text-sm font-medium transition-colors hover:text-gray-900" style={{ color: MUTED }}>
              My Bills
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden sm:block text-sm font-medium transition-colors hover:text-gray-900" style={{ color: MUTED }}>
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Link
            href="/upload"
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 hover:scale-105 hover:brightness-95"
            style={{ background: A, color: DARK }}
          >
            Try it free →
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Sample output card (hero right side) ───────────────── */
function SampleOutputCard() {
  return (
    <div className="relative mx-auto max-w-md lg:mx-0">
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.6) 0%, transparent 70%)" }}
      />

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "#0A0F1E",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-semibold text-slate-400">Your Analysis</p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold text-red-400"
            style={{ background: "rgba(239,68,68,0.12)" }}
          >
            ⚠ Overpaying
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Rate comparison */}
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">
              Rate Comparison
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">Your rate</p>
                <p className="text-2xl font-black text-white">
                  $0.21<span className="text-xs font-normal text-slate-500">/kWh</span>
                </p>
              </div>
              <div className="text-slate-700 text-lg">↔</div>
              <div className="flex-1 text-right">
                <p className="text-xs text-slate-500 mb-0.5">US average</p>
                <p className="text-2xl font-black" style={{ color: A }}>
                  $0.16<span className="text-xs font-normal text-slate-500">/kWh</span>
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-slate-600">Yours</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full bg-red-500" style={{ width: "70%" }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-slate-600">Average</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: "53%", background: A }} />
                </div>
              </div>
            </div>
          </div>

          {/* Provider recommendation */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.14)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-2">
              Switch &amp; Save
            </p>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">Green Mountain Energy</p>
                <p className="text-xs text-slate-500 mt-0.5">$0.11/kWh · Available in your area</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-emerald-400">$45</p>
                <p className="text-xs text-emerald-400/50">/month saved</p>
              </div>
            </div>
            <div
              className="mt-3 rounded-lg py-1.5 text-center text-xs font-semibold text-emerald-400"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              $540 annual savings ✓
            </div>
          </div>

          {/* Tip preview */}
          <div
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.14)" }}
          >
            <span className="text-lg">💡</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: A }}>Time-of-Use Pricing</p>
              <p className="text-xs text-slate-500">Run appliances after 9pm · save ~$20/mo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 pt-16 flex items-center">
      {/* Gradient bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,166,35,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl py-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div
              className="fade-up fade-up-1 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
              style={{ background: "#FEF9EE", border: "1px solid rgba(245,166,35,0.3)", color: "#92400E" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: A }} />
              AI-powered energy analysis
            </div>

            <h1
              className="fade-up fade-up-2 font-extrabold leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", color: DARK }}
            >
              Stop overpaying
              <br />
              for <span style={{ color: A }}>electricity</span>
            </h1>

            <p
              className="fade-up fade-up-3 text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: MUTED }}
            >
              Upload your utility bill. Claude AI finds cheaper providers in your
              area and gives you a personalized plan to cut your bill — in under
              10 seconds.
            </p>

            <div className="fade-up fade-up-4 flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  background: A,
                  color: DARK,
                  padding: "14px 28px",
                  fontSize: "1rem",
                  boxShadow: `0 4px 20px rgba(245,166,35,0.35)`,
                }}
              >
                Analyze My Bill
                <span className="text-lg">→</span>
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium transition-colors hover:text-gray-600"
                style={{ color: "#9CA3AF" }}
              >
                See how it works ↓
              </a>
            </div>

            <div className="fade-up fade-up-5 flex flex-wrap items-center gap-5 text-xs" style={{ color: "#9CA3AF" }}>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "#22C55E" }}>✓</span> Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "#22C55E" }}>✓</span> No account needed
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "#22C55E" }}>✓</span> Results in 10 sec
              </span>
            </div>
          </div>

          {/* Right: Product preview */}
          <div className="fade-up fade-up-3">
            <SampleOutputCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats strip ────────────────────────────────────────── */
const STATS = [
  { value: "$0.16", label: "US average rate per kWh" },
  { value: "~30%", label: "of households overpay vs benchmark" },
  { value: "$540+", label: "average annual savings found" },
];

function StatsStrip() {
  return (
    <section style={{ background: SURFACE }} className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {STATS.map(({ value, label }) => (
            <div key={value} className="py-8 sm:py-4 sm:px-10 text-center">
              <p className="text-3xl font-black tracking-tight mb-1" style={{ color: DARK }}>
                {value}
              </p>
              <p className="text-sm" style={{ color: MUTED }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: BarChart3,
    title: "Rate Analysis",
    body: "See exactly how your $/kWh compares to the US average. Know instantly if you're overpaying.",
    accent: "#3B82F6",
    bg: "rgba(59,130,246,0.06)",
  },
  {
    icon: TrendingDown,
    title: "Provider Switch",
    body: "Get 2–3 real cheaper alternatives in your area with exact monthly and annual savings calculated.",
    accent: "#22C55E",
    bg: "rgba(34,197,94,0.06)",
  },
  {
    icon: Sparkles,
    title: "Savings Action Plan",
    body: "Personalized tips — time-of-use pricing, smart equipment, behavioral changes — with dollar estimates.",
    accent: "#F5A623",
    bg: "rgba(245,166,35,0.06)",
  },
  {
    icon: Upload,
    title: "Usage Trends",
    body: "Upload bills over time to track consumption, spot seasonal patterns, and measure your improvements.",
    accent: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
  },
];

function Features() {
  return (
    <section id="features" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: A }}>
            Everything you get
          </p>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
            Your complete energy report
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: MUTED }}>
            One bill upload gives you everything you need to cut your energy costs today.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body, accent, bg }) => (
            <div
              key={title}
              className="group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: bg,
                border: `1px solid ${accent}22`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${accent}18` }}
              >
                <Icon size={18} style={{ color: accent }} />
              </div>
              <h3 className="mb-2 text-sm font-bold" style={{ color: DARK }}>
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

/* ── How it works ───────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your Bill",
    body: "Drag and drop a photo or PDF of any utility bill. Any provider, any format.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Claude Analyzes It",
    body: "AI extracts your usage, rate, and provider — then finds cheaper alternatives near you.",
  },
  {
    num: "03",
    icon: TrendingDown,
    title: "Start Saving",
    body: "Get your rate vs the benchmark, provider recommendations, and a personalized savings plan.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: SURFACE }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: A }}>
            Simple process
          </p>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: DARK }}>
            How it works
          </h2>
          <p className="mt-3 text-sm" style={{ color: MUTED }}>
            Three steps from bill to savings — powered by Claude AI.
          </p>
        </div>

        <div className="relative grid gap-5 sm:grid-cols-3">
          {/* Arrow connectors (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-10 hidden sm:flex items-center">
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
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>
            ))}
            <div className="flex-1" />
          </div>

          {STEPS.map(({ num, icon: Icon, title, body }) => (
            <div
              key={num}
              className="group relative rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
                borderRadius: "16px",
              }}
            >
              <div className="mb-5 flex items-start justify-between">
                <span className="text-3xl font-black leading-none" style={{ color: A }}>
                  {num}
                </span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: SURFACE }}
                >
                  <Icon size={15} style={{ color: MUTED }} />
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold" style={{ color: DARK }}>
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

/* ── Final CTA ─────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section
      className="py-24"
      style={{
        background: DARK,
      }}
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: A }}>
          Ready to find out?
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
          Check your rate in 10 seconds
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
          Upload your bill once. Get your rate vs the benchmark, cheaper providers near
          you, and a personalized plan to start saving immediately.
        </p>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
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

        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
          No account required · No manual data entry · Results in under 10 seconds
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
      style={{ background: SURFACE, borderColor: "rgba(0,0,0,0.07)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
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
      <StatsStrip />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}
