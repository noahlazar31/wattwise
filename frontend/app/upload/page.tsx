"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadBill, createHousehold, linkHouseholdToUser } from "@/lib/api";

type Status = "idle" | "uploading" | "parsing" | "done" | "error";

const STEPS = ["Upload", "Analyze", "Results"];

function StepIndicator({ status }: { status: Status }) {
  const activeStep = status === "idle" ? 0 : status === "uploading" ? 0 : status === "parsing" ? 1 : 2;

  return (
    <div className="flex items-center gap-2 mb-10">
      {STEPS.map((label, i) => {
        const done = i < activeStep || status === "done";
        const active = i === activeStep && status !== "done" && status !== "error";

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={{
                  background: done
                    ? "rgba(34,197,94,0.2)"
                    : active
                    ? "rgba(59,130,246,0.2)"
                    : "rgba(255,255,255,0.06)",
                  border: done
                    ? "1px solid rgba(34,197,94,0.4)"
                    : active
                    ? "1px solid rgba(59,130,246,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: done ? "#22C55E" : active ? "#60A5FA" : "#475569",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="text-xs font-medium transition-colors duration-300"
                style={{ color: done ? "#22C55E" : active ? "#E2E8F0" : "#475569" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-px w-8 transition-colors duration-300"
                style={{ background: i < activeStep || done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setErrorMsg(null);
    setStatus("idle");
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setStatus("uploading");
      const { household } = await createHousehold({});
      const householdId = household.id;

      setStatus("parsing");
      await uploadBill(file, householdId);

      // If signed in, link this household to their account
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clerkUserId = (window as any).Clerk?.user?.id;
      if (clerkUserId) await linkHouseholdToUser(householdId, clerkUserId);

      setStatus("done");
      setTimeout(() => {
        router.push(`/dashboard/${householdId}`);
      }, 900);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const isLoading = status === "uploading" || status === "parsing";

  return (
    <div
      className="dark-page relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Subtle orb */}
      <div
        className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Nav */}
      <header
        className="relative z-10 flex h-14 items-center px-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mx-auto flex w-full max-w-5xl items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all duration-200 group-hover:scale-110"
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              ⚡
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">WattWise</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Upload your utility bill
            </h1>
            <p className="text-sm text-slate-500">
              Any electric or gas bill works. We&apos;ll extract everything automatically.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center">
            <StepIndicator status={status} />
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Drop zone */}
            {!isLoading && status !== "done" && (
              <div>
                <label
                  className="flex flex-col items-center justify-center w-full h-52 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1.5px dashed rgba(59,130,246,0.3)",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile(f);
                  }}
                >
                  <div className="flex flex-col items-center gap-3 text-center px-6">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        Drag &amp; drop your utility bill
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        or click to browse · JPG, PNG, PDF · max 10 MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>

                {/* File preview */}
                {file && (
                  <div
                    className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-lg">📎</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-300 truncate">{file.name}</p>
                      <p className="text-xs text-slate-600">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-slate-600 hover:text-slate-400 text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center gap-5 py-10">
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <div className="absolute inset-0 rounded-2xl border-2 border-t-transparent border-blue-500 animate-spin" />
                  <span className="text-2xl z-10">
                    {status === "uploading" ? "📤" : "🤖"}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white mb-1">
                    {status === "uploading" ? "Uploading your bill…" : "Claude is analyzing your bill…"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {status === "uploading"
                      ? "Sending to our secure servers"
                      : "Extracting data, finding cheaper providers…"}
                  </p>
                </div>
              </div>
            )}

            {/* Done */}
            {status === "done" && (
              <div className="flex flex-col items-center gap-4 py-10">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  ✅
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white mb-1">Analysis complete!</p>
                  <p className="text-xs text-slate-500">Redirecting to your dashboard…</p>
                </div>
              </div>
            )}

            {/* Error */}
            {status === "error" && errorMsg && (
              <div
                className="mb-4 rounded-xl px-4 py-3 text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* CTA */}
            {!isLoading && status !== "done" && (
              <button
                onClick={handleSubmit}
                disabled={!file}
                className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: file ? "rgba(59,130,246,0.85)" : "rgba(255,255,255,0.05)",
                  color: file ? "#fff" : "#475569",
                  cursor: file ? "pointer" : "not-allowed",
                  border: file ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {file ? "Analyze Bill →" : "Select a bill to continue"}
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-slate-700">
            Your bill is processed securely and never shared with third parties.
          </p>
        </div>
      </main>
    </div>
  );
}
