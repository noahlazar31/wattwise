from typing import Any
from services.supabase_client import get_supabase

US_AVERAGE_RATE = 0.16  # $/kWh national benchmark
OVERPAYING_THRESHOLD = 1.20  # flag if >20% above benchmark


def _calculate_insights(bills: list[dict]) -> list[dict]:
    insights = []

    if not bills:
        return insights

    # Sort by billing period start ascending for time-series math
    sorted_bills = sorted(bills, key=lambda b: b["billing_period_start"])

    # --- 1. Average cost per kWh vs US average ---
    total_cost = sum(b["total_cost"] for b in sorted_bills)
    total_kwh = sum(b["kwh_used"] for b in sorted_bills)

    if total_kwh > 0:
        avg_rate = total_cost / total_kwh
        rate_vs_benchmark = ((avg_rate - US_AVERAGE_RATE) / US_AVERAGE_RATE) * 100
        overpaying = avg_rate > (US_AVERAGE_RATE * OVERPAYING_THRESHOLD)

        insights.append(
            {
                "insight_type": "avg_rate_vs_benchmark",
                "insight_value": (
                    f"Your average rate is ${avg_rate:.4f}/kWh "
                    f"({'%.1f' % abs(rate_vs_benchmark)}% "
                    f"{'above' if rate_vs_benchmark > 0 else 'below'} "
                    f"the US average of ${US_AVERAGE_RATE}/kWh). "
                    f"{'⚠️ You may be overpaying.' if overpaying else '✅ Your rate looks competitive.'}"
                ),
            }
        )

    # --- 2. Month-over-month usage change ---
    if len(sorted_bills) >= 2:
        latest = sorted_bills[-1]
        previous = sorted_bills[-2]
        if previous["kwh_used"] > 0:
            mom_change = (
                (latest["kwh_used"] - previous["kwh_used"]) / previous["kwh_used"]
            ) * 100
            direction = "increased" if mom_change > 0 else "decreased"
            insights.append(
                {
                    "insight_type": "mom_usage_change",
                    "insight_value": (
                        f"Your kWh usage {direction} by {abs(mom_change):.1f}% "
                        f"compared to the previous billing period "
                        f"({previous['kwh_used']} → {latest['kwh_used']} kWh)."
                    ),
                }
            )

    # --- 3. Estimated annual spend from last 3 months ---
    recent_bills = sorted_bills[-3:]
    if recent_bills:
        avg_monthly_cost = sum(b["total_cost"] for b in recent_bills) / len(recent_bills)
        estimated_annual = avg_monthly_cost * 12
        insights.append(
            {
                "insight_type": "estimated_annual_spend",
                "insight_value": (
                    f"Based on your last {len(recent_bills)} bill(s), your estimated "
                    f"annual energy spend is ${estimated_annual:,.2f} "
                    f"(~${avg_monthly_cost:,.2f}/month)."
                ),
            }
        )

    # --- 4. Overpaying flag ---
    if total_kwh > 0:
        avg_rate = total_cost / total_kwh
        if avg_rate > US_AVERAGE_RATE * OVERPAYING_THRESHOLD:
            savings_potential = (avg_rate - US_AVERAGE_RATE) * total_kwh
            insights.append(
                {
                    "insight_type": "overpaying_flag",
                    "insight_value": (
                        f"Your effective rate is more than 20% above the national average. "
                        f"Switching to a lower-rate plan could save approximately "
                        f"${savings_potential:,.2f} on your analysed billing periods."
                    ),
                }
            )

    return insights


def generate_and_store_insights(household_id: str) -> list[dict]:
    supabase = get_supabase()

    # Fetch all bills for household
    result = (
        supabase.table("utility_bills")
        .select("*")
        .eq("household_id", household_id)
        .order("billing_period_start", desc=False)
        .execute()
    )
    bills = result.data or []

    insights = _calculate_insights(bills)

    # Upsert: delete old generated insights and insert fresh ones
    supabase.table("insights").delete().eq("household_id", household_id).execute()

    stored = []
    for insight in insights:
        row = {"household_id": household_id, **insight}
        res = supabase.table("insights").insert(row).execute()
        if res.data:
            stored.append(res.data[0])

    return stored
