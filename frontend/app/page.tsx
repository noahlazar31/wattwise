import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Upload Your Bill",
    description:
      "Drag and drop a photo or PDF of your utility bill. We accept any format.",
  },
  {
    number: "02",
    title: "AI Analyzes It",
    description:
      "Claude extracts your usage, cost, and rate plan in seconds — no manual entry.",
  },
  {
    number: "03",
    title: "See Your Savings",
    description:
      "Get a personalized breakdown showing how your rate compares to the national average.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl tracking-tight">WattWise</span>
          </div>
          <Link
            href="/upload"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Get started →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full mb-8 border border-amber-200">
            <span>⚡</span>
            <span>AI-powered energy analysis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
            Find out if you&apos;re
            <br />
            <span className="text-amber-500">overpaying for energy</span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your utility bill and we&apos;ll instantly compare your rate
            to the national average — no account signup, no manual data entry.
          </p>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-zinc-700 transition-colors shadow-lg shadow-zinc-200"
          >
            Upload Your Bill
            <span>→</span>
          </Link>

          <p className="mt-4 text-sm text-zinc-400">
            Free · No account required · Results in under 10 seconds
          </p>
        </section>

        {/* How it works */}
        <section className="bg-zinc-50 border-y border-zinc-100 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-zinc-900 mb-4">
              How it works
            </h2>
            <p className="text-center text-zinc-500 mb-14 max-w-xl mx-auto">
              Three steps from bill to savings — powered by Claude AI.
            </p>

            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm"
                >
                  <div className="text-4xl font-black text-amber-400 mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-zinc-900 mb-2">$0.16</div>
              <p className="text-zinc-500 text-sm">US average cost per kWh</p>
            </div>
            <div>
              <div className="text-4xl font-black text-zinc-900 mb-2">~30%</div>
              <p className="text-zinc-500 text-sm">
                of households overpay vs benchmark
              </p>
            </div>
            <div>
              <div className="text-4xl font-black text-zinc-900 mb-2">$400+</div>
              <p className="text-zinc-500 text-sm">
                average annual overpayment identified
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-zinc-900 py-20 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to find out?
            </h2>
            <p className="text-zinc-400 mb-8">
              Upload any utility bill and get your personalised energy report in
              seconds.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-amber-400 text-zinc-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-amber-300 transition-colors"
            >
              Upload Your Bill
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-6 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} WattWise · Powered by Claude AI
      </footer>
    </div>
  );
}
