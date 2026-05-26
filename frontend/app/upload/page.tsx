"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DropZone from "@/components/DropZone";
import { uploadBill, createHousehold } from "@/lib/api";

type Status = "idle" | "uploading" | "parsing" | "done" | "error";

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

      // Create an anonymous household (no user account required)
      const { household } = await createHousehold({});
      const householdId = household.id;

      setStatus("parsing");

      await uploadBill(file, householdId);

      setStatus("done");
      // Redirect to dashboard after brief pause
      setTimeout(() => {
        router.push(`/dashboard/${householdId}`);
      }, 800);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const isLoading = status === "uploading" || status === "parsing";

  const statusMessages: Record<Status, string> = {
    idle: "",
    uploading: "Uploading your bill…",
    parsing: "Claude is reading your bill…",
    done: "Done! Redirecting to your dashboard…",
    error: "",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl tracking-tight">WattWise</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 mb-3">
              Upload your utility bill
            </h1>
            <p className="text-zinc-500">
              Any electric, gas, or multi-utility bill works. We&apos;ll extract the
              data automatically.
            </p>
          </div>

          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-8">
            <DropZone onFile={handleFile} disabled={isLoading} />

            {file && !isLoading && status !== "done" && (
              <div className="mt-4 flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
                <span className="text-xl">📎</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Status indicator */}
            {isLoading && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-500">{statusMessages[status]}</p>
              </div>
            )}

            {status === "done" && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-3xl">✅</span>
                <p className="text-sm text-zinc-500">{statusMessages.done}</p>
              </div>
            )}

            {status === "error" && errorMsg && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">⚠️ {errorMsg}</p>
              </div>
            )}

            {!isLoading && status !== "done" && (
              <button
                onClick={handleSubmit}
                disabled={!file}
                className={`
                  mt-6 w-full py-3.5 rounded-xl font-semibold text-base transition-all
                  ${file
                    ? "bg-zinc-900 text-white hover:bg-zinc-700 shadow-md shadow-zinc-200"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }
                `}
              >
                Analyze Bill →
              </button>
            )}
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Your bill is processed securely and never shared.
          </p>
        </div>
      </main>
    </div>
  );
}
