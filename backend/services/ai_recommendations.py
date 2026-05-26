import anthropic
import json
import re
from config import get_settings


RECOMMENDATIONS_PROMPT = """You are an energy savings expert for US households. Analyze the given utility data and return ONLY valid JSON with no other text.

Required format:
{
  "provider_recommendations": [
    {
      "name": "Provider Name",
      "estimated_rate": 0.11,
      "monthly_savings": 28.00,
      "annual_savings": 336.00,
      "description": "One sentence explaining this alternative"
    }
  ],
  "savings_tips": [
    {
      "title": "Short Action Title",
      "tip": "Specific actionable advice in 1-2 sentences.",
      "monthly_savings": 20.00,
      "category": "behavior"
    }
  ]
}

Rules:
- Provide exactly 2-3 provider_recommendations
- Provide exactly 3-4 savings_tips
- category must be one of: behavior, equipment, plan, solar
- Use real US energy providers that operate in the inferred state/region
- Infer the state from the utility_provider name (e.g. PG&E = California, Con Edison = New York, FPL = Florida, Xcel Energy = Colorado/Minnesota, Dominion = Virginia, Eversource = New England)
- Base savings estimates on the actual kwh_used and rate difference — be realistic
- If state cannot be inferred, recommend well-known national deregulated alternatives like Green Mountain Energy, Constellation, or Arcadia
"""


def generate_ai_recommendations(
    utility_provider: str | None,
    current_rate: float,
    kwh_used: float,
    total_cost: float,
    rate_plan: str | None = None,
) -> dict:
    settings = get_settings()
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    message = f"""{RECOMMENDATIONS_PROMPT}

Household data:
- Current provider: {utility_provider or "Unknown"}
- Effective rate: ${current_rate:.4f}/kWh
- Monthly usage: {kwh_used:.0f} kWh
- Monthly bill: ${total_cost:.2f}
- Rate plan: {rate_plan or "Standard residential"}"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": message}],
    )

    raw = response.content[0].text.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw)
