import json
from services.supabase_client import get_supabase

US_AVERAGE_RATE = 0.16
OVERPAYING_THRESHOLD = 1.20

AI_TYPES = {"provider_recommendation", "savings_tip"}
RULE_TYPES = {"avg_rate_vs_benchmark", "mom_usage_change", "estimated_annual_spend", "overpaying_flag"}


def _calculate_rule_insights(bills: list[dict]) -> list[dict]:
    if not bills:
        return []

    sorted_bills = sorted(bills, key=lambda b: b["billing_period_start"])
    total_cost = sum(b["total_cost"] for b in sorted_bills)
    total_kwh = sum(b["kwh_used"] for b in sorted_bills)
    insights = []

    if total_kwh > 0:
        avg_rate = total_cost / total_kwh
        pct = ((avg_rate - US_AVERAGE_RATE) / US_AVERAGE_RATE) * 100
        overpaying = avg_rate > (US_AVERAGE_RATE * OVERPAYING_THRESHOLD)
        insights.append({
            "insight_type": "avg_rate_vs_benchmark",
            "insight_value": (
                f"Your average rate is ${avg_rate:.4f}/kWh "
                f"({'%.1f' % abs(pct)}% "
                f"{'above' if pct > 0 else 'below'} "
                f"the US average of ${US_AVERAGE_RATE}/kWh). "
                f"{'⚠️ You may be overpaying.' if overpaying else '✅ Your rate looks competitive.'}"
            ),
        })

    if len(sorted_bills) >= 2:
        latest = sorted_bills[-1]
        prev = sorted_bills[-2]
        if prev["kwh_used"] > 0:
            mom = ((latest["kwh_used"] - prev["kwh_used"]) / prev["kwh_used"]) * 100
            insights.append({
                "insight_type": "mom_usage_change",
                "insight_value": (
                    f"Your kWh usage {'increased' if mom > 0 else 'decreased'} by {abs(mom):.1f}% "
                    f"vs the previous period ({prev['kwh_used']} → {latest['kwh_used']} kWh)."
                ),
            })

    recent = sorted_bills[-3:]
    if recent:
        avg_mo = sum(b["total_cost"] for b in recent) / len(recent)
        insights.append({
            "insight_type": "estimated_annual_spend",
            "insight_value": (
                f"Based on your last {len(recent)} bill(s), estimated annual spend is "
                f"${avg_mo * 12:,.2f} (~${avg_mo:,.2f}/month)."
            ),
        })

    if total_kwh > 0:
        avg_rate = total_cost / total_kwh
        if avg_rate > US_AVERAGE_RATE * OVERPAYING_THRESHOLD:
            savings_potential = (avg_rate - US_AVERAGE_RATE) * total_kwh
            insights.append({
                "insight_type": "overpaying_flag",
                "insight_value": (
                    f"Your rate is >20% above the national average. "
                    f"Switching to a lower-rate plan could save ~${savings_potential:,.2f} "
                    f"over your analysed billing periods."
                ),
            })

    return insights


def _generate_ai_insights(bills: list[dict]) -> list[dict]:
    from services.ai_recommendations import generate_ai_recommendations

    sorted_bills = sorted(bills, key=lambda b: b["billing_period_start"])
    latest = sorted_bills[-1]
    total_cost = sum(b["total_cost"] for b in sorted_bills)
    total_kwh = sum(b["kwh_used"] for b in sorted_bills)
    avg_rate = total_cost / total_kwh if total_kwh > 0 else 0.16

    recs = generate_ai_recommendations(
        utility_provider=latest.get("utility_provider"),
        current_rate=avg_rate,
        kwh_used=float(latest["kwh_used"]),
        total_cost=float(latest["total_cost"]),
        rate_plan=latest.get("rate_plan"),
    )

    result = []
    for rec in recs.get("provider_recommendations", []):
        result.append({
            "insight_type": "provider_recommendation",
            "insight_value": json.dumps(rec),
        })
    for tip in recs.get("savings_tips", []):
        result.append({
            "insight_type": "savings_tip",
            "insight_value": json.dumps(tip),
        })
    return result


def generate_and_store_insights(household_id: str) -> list[dict]:
    supabase = get_supabase()

    bills_res = (
        supabase.table("utility_bills")
        .select("*")
        .eq("household_id", household_id)
        .order("billing_period_start", desc=False)
        .execute()
    )
    bills = bills_res.data or []

    # Check if AI recommendations are already cached
    ai_check = (
        supabase.table("insights")
        .select("id")
        .eq("household_id", household_id)
        .eq("insight_type", "provider_recommendation")
        .execute()
    )
    has_cached_ai = bool(ai_check.data)

    # Always refresh rule-based insights
    for t in RULE_TYPES:
        supabase.table("insights").delete().eq("household_id", household_id).eq("insight_type", t).execute()

    stored: list[dict] = []
    for insight in _calculate_rule_insights(bills):
        row = {"household_id": household_id, **insight}
        res = supabase.table("insights").insert(row).execute()
        if res.data:
            stored.append(res.data[0])

    # AI recommendations: reuse cache or generate fresh on first visit
    if has_cached_ai:
        ai_res = (
            supabase.table("insights")
            .select("*")
            .eq("household_id", household_id)
            .in_("insight_type", list(AI_TYPES))
            .execute()
        )
        stored.extend(ai_res.data or [])
    elif bills:
        try:
            for insight in _generate_ai_insights(bills):
                row = {"household_id": household_id, **insight}
                res = supabase.table("insights").insert(row).execute()
                if res.data:
                    stored.append(res.data[0])
        except Exception:
            pass  # Fail gracefully if AI is unavailable

    return stored
