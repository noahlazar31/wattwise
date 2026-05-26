from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from typing import Optional
from services.supabase_client import get_supabase

router = APIRouter()


class EmailCapturePayload(BaseModel):
    email: EmailStr
    household_id: Optional[str] = None
    source: Optional[str] = "dashboard"


@router.post("/email-capture")
async def capture_email(payload: EmailCapturePayload):
    """Store an email address for rate alerts and marketing."""
    supabase = get_supabase()
    try:
        supabase.table("email_captures").insert({
            "email": payload.email,
            "household_id": payload.household_id,
            "source": payload.source,
        }).execute()
    except Exception:
        pass  # Silently ignore duplicates / errors — never fail on email capture
    return {"success": True}
