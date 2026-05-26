from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.supabase_client import get_supabase

router = APIRouter()


class HouseholdCreate(BaseModel):
    user_id: Optional[str] = None
    building_id: Optional[str] = None
    unit_number: Optional[str] = None
    sq_footage: Optional[int] = None


class HouseholdLink(BaseModel):
    clerk_user_id: str


@router.post("/households")
async def create_household(payload: HouseholdCreate):
    supabase = get_supabase()
    try:
        result = (
            supabase.table("households")
            .insert(payload.model_dump(exclude_none=True))
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Database insert failed: {str(exc)}")
    return {"household": result.data[0] if result.data else {}}


@router.patch("/households/{household_id}/link")
async def link_household(household_id: str, payload: HouseholdLink):
    """Link an anonymous household to a Clerk user account."""
    supabase = get_supabase()
    try:
        result = (
            supabase.table("households")
            .update({"clerk_user_id": payload.clerk_user_id})
            .eq("id", household_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Link failed: {str(exc)}")
    return {"success": True}


@router.get("/households/user/{clerk_user_id}")
async def get_user_households(clerk_user_id: str):
    """Return all households linked to a Clerk user, with their latest bill summary."""
    supabase = get_supabase()
    try:
        households_res = (
            supabase.table("households")
            .select("id, created_at")
            .eq("clerk_user_id", clerk_user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    households = households_res.data or []

    # Enrich each household with its latest bill
    enriched = []
    for h in households:
        bills_res = (
            supabase.table("utility_bills")
            .select("*")
            .eq("household_id", h["id"])
            .order("billing_period_start", desc=True)
            .limit(1)
            .execute()
        )
        latest_bill = bills_res.data[0] if bills_res.data else None
        enriched.append({**h, "latest_bill": latest_bill})

    return {"households": enriched}


@router.get("/households/{household_id}")
async def get_household(household_id: str):
    supabase = get_supabase()
    try:
        result = (
            supabase.table("households")
            .select("*, buildings(*)")
            .eq("id", household_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Household not found")
    return {"household": result.data}
