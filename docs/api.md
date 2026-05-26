# WattWise API Documentation

Base URL: `http://localhost:8000` (dev) | `https://your-railway-app.up.railway.app` (prod)

Interactive docs: `GET /docs` (Swagger UI)

---

## Endpoints

### `GET /health`
Returns API status.

**Response 200:**
```json
{ "status": "ok", "service": "WattWise API", "version": "1.0.0" }
```

---

### `POST /upload-bill`
Upload a utility bill image or PDF. Claude Vision extracts structured data.

**Content-Type:** `multipart/form-data`

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | File | ✓ | JPG, PNG, GIF, WEBP, PDF — max 10 MB |
| `household_id` | string (UUID) | ✓ | Must exist in `households` table |

**Response 201:**
```json
{
  "success": true,
  "household_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bill": {
    "id": "uuid",
    "household_id": "uuid",
    "billing_period_start": "2025-03-01",
    "billing_period_end": "2025-03-31",
    "kwh_used": 485.3,
    "total_cost": 89.42,
    "rate_plan": "E-TOU-C",
    "utility_provider": "Pacific Gas & Electric",
    "account_last_four": "4821",
    "raw_image_url": "https://...",
    "created_at": "2025-05-25T12:00:00Z"
  }
}
```

**Errors:**
- `400` — unsupported file type or file too large
- `422` — Claude could not extract data from the bill
- `502` — storage or database failure

---

### `GET /bills/{household_id}`
Returns all utility bills for a household, newest first.

**Response 200:**
```json
{
  "household_id": "uuid",
  "bills": [ /* Bill[] */ ]
}
```

---

### `GET /insights/{household_id}`
Calculates and stores fresh insights, then returns them.

**Insight types:**

| `insight_type` | Meaning |
|----------------|---------|
| `avg_rate_vs_benchmark` | Your $/kWh vs US average |
| `mom_usage_change` | Month-over-month kWh change |
| `estimated_annual_spend` | Projected annual cost |
| `overpaying_flag` | Alert: rate >20% above benchmark |

**Response 200:**
```json
{
  "household_id": "uuid",
  "count": 3,
  "insights": [
    {
      "id": "uuid",
      "household_id": "uuid",
      "insight_type": "avg_rate_vs_benchmark",
      "insight_value": "Your average rate is $0.1843/kWh (15.2% above the US average of $0.16/kWh).",
      "generated_at": "2025-05-25T12:00:00Z"
    }
  ]
}
```

---

### `POST /households`
Create a new household.

**Body (JSON):**
```json
{
  "user_id": "uuid (optional)",
  "building_id": "uuid (optional)",
  "unit_number": "4B (optional)",
  "sq_footage": 850
}
```

**Response 201:**
```json
{ "household": { "id": "uuid", "created_at": "..." } }
```

---

### `GET /households/{household_id}`
Fetch household details including joined building info.

**Response 200:**
```json
{
  "household": {
    "id": "uuid",
    "unit_number": "4B",
    "sq_footage": 850,
    "buildings": { "address": "123 Main St", "city": "Oakland", ... }
  }
}
```
