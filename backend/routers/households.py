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
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Household not found")

    return {"household": result.data}
