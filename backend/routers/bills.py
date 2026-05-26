import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from services.supabase_client import get_supabase
from services.bill_parser import parse_bill_with_claude

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload-bill")
async def upload_bill(
    file: UploadFile = File(...),
    household_id: str = Form(...),
):
    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, GIF, WEBP, PDF.",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit.")

    supabase = get_supabase()

    # Generate a unique storage path
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
    storage_path = f"{household_id}/{uuid.uuid4()}.{ext}"

    # Upload raw image to Supabase Storage
    try:
        supabase.storage.from_("bills").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type},
        )
        raw_image_url = (
            supabase.storage.from_("bills").get_public_url(storage_path)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Storage upload failed: {str(exc)}"
        )

    # Parse bill with Claude Vision
    try:
        parsed = parse_bill_with_claude(file_bytes, file.filename)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Claude could not parse this bill: {str(exc)}",
        )

    # Insert into utility_bills
    bill_row = {
        "household_id": household_id,
        "billing_period_start": parsed["billing_period_start"],
        "billing_period_end": parsed["billing_period_end"],
        "kwh_used": parsed["kwh_used"],
        "total_cost": parsed["total_cost"],
        "rate_plan": parsed.get("rate_plan"),
        "utility_provider": parsed.get("utility_provider"),
        "account_last_four": parsed.get("account_last_four"),
        "raw_image_url": raw_image_url,
    }

    try:
        result = supabase.table("utility_bills").insert(bill_row).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Database insert failed: {str(exc)}"
        )

    return JSONResponse(
        status_code=201,
        content={
            "success": True,
            "bill": result.data[0] if result.data else bill_row,
            "household_id": household_id,
        },
    )


@router.get("/bills/{household_id}")
async def get_bills(household_id: str):
    supabase = get_supabase()

    try:
        result = (
            supabase.table("utility_bills")
            .select("*")
            .eq("household_id", household_id)
            .order("billing_period_start", desc=True)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Database query failed: {str(exc)}")

    return {"bills": result.data or [], "household_id": household_id}
