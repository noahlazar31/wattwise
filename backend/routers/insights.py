from fastapi import APIRouter, HTTPException
from services.insights_engine import generate_and_store_insights
from services.supabase_client import get_supabase

router = APIRouter()


@router.get("/insights/{household_id}")
async def get_insights(household_id: str):
    try:
        insights = generate_and_store_insights(household_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Insights generation failed: {str(exc)}"
        )

    return {
        "insights": insights,
        "household_id": household_id,
        "count": len(insights),
    }
