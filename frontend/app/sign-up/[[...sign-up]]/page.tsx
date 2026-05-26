import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="dark-page relative min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0A0F1E" }}
    >
      <div className="mb-8 text-center">
        <a href="/" className="inline-flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
          >
            ⚡
          </span>
          <span className="text-lg font-bold text-white tracking-tight">WattWise</span>
        </a>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#0F172A",
            colorText: "#F1F5F9",
            colorPrimary: "#3B82F6",
            colorInputBackground: "#1E293B",
            colorInputText: "#F1F5F9",
          },
        }}
      />
    </div>
  );
}
