import anthropic
import base64
import json
import re
from pathlib import Path
from config import get_settings


BILL_EXTRACTION_PROMPT = (
    "Extract the following from this utility bill and return valid JSON only, "
    "no extra text: billing_period_start (YYYY-MM-DD), billing_period_end (YYYY-MM-DD), "
    "kwh_used (number), total_cost (number), utility_provider (string), "
    "rate_plan (string), account_last_four (last 4 digits of account number as string)"
)


def _encode_image(file_bytes: bytes, media_type: str) -> str:
    return base64.standard_b64encode(file_bytes).decode("utf-8")


def _detect_media_type(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    mapping = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
    }
    return mapping.get(ext, "image/jpeg")


def parse_bill_with_claude(file_bytes: bytes, filename: str) -> dict:
    settings = get_settings()
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    media_type = _detect_media_type(filename)
    encoded = _encode_image(file_bytes, media_type)

    # For PDFs, we treat them as documents; for images use vision
    if media_type == "application/pdf":
        content = [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": encoded,
                },
            },
            {"type": "text", "text": BILL_EXTRACTION_PROMPT},
        ]
    else:
        content = [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": encoded,
                },
            },
            {"type": "text", "text": BILL_EXTRACTION_PROMPT},
        ]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": content}],
    )

    raw_text = response.content[0].text.strip()

    # Strip markdown code fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    parsed = json.loads(raw_text)

    # Normalise field types
    parsed["kwh_used"] = float(parsed["kwh_used"])
    parsed["total_cost"] = float(parsed["total_cost"])
    parsed["account_last_four"] = str(parsed.get("account_last_four", ""))[-4:]

    return parsed
