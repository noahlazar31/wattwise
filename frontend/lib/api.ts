const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://wattwise-production-b4ae.up.railway.app";

export interface Bill {
  id: string;
  household_id: string;
  billing_period_start: string;
  billing_period_end: string;
  kwh_used: number;
  total_cost: number;
  rate_plan: string | null;
  utility_provider: string | null;
  account_last_four: string | null;
  raw_image_url: string | null;
  created_at: string;
}

export interface Insight {
  id: string;
  household_id: string;
  insight_type: string;
  insight_value: string;
  generated_at: string;
}

export async function uploadBill(
  file: File,
  householdId: string
): Promise<{ success: boolean; bill: Bill; household_id: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("household_id", householdId);

  const res = await fetch(`${API_URL}/upload-bill`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail ?? "Upload failed");
  }

  return res.json();
}

export async function getBills(
  householdId: string
): Promise<{ bills: Bill[]; household_id: string }> {
  const res = await fetch(`${API_URL}/bills/${householdId}`);
  if (!res.ok) throw new Error("Failed to fetch bills");
  return res.json();
}

export async function getInsights(
  householdId: string
): Promise<{ insights: Insight[]; household_id: string; count: number }> {
  const res = await fetch(`${API_URL}/insights/${householdId}`);
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
}

export async function createHousehold(data: {
  unit_number?: string;
  sq_footage?: number;
}): Promise<{ household: { id: string } }> {
  const res = await fetch(`${API_URL}/households`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create household");
  return res.json();
}
