# ⚡ WattWise — Energy Intelligence Platform

> Upload a utility bill. Find out if you're overpaying for energy — powered by Claude AI.

---

## Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python FastAPI                      |
| Database   | Supabase (PostgreSQL + Storage)     |
| Auth       | Supabase (optional / RLS-ready)     |
| AI/OCR     | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Frontend   | Next.js 15 + Tailwind CSS           |
| Charts     | Recharts                            |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Data Model

```
users
  id (uuid PK)
  email (text)
  created_at (timestamptz)

buildings
  id (uuid PK)
  address, city, state, zip (text)
  total_units (int)
  property_manager_id (uuid → users)
  created_at (timestamptz)

households
  id (uuid PK)
  user_id (uuid → users)
  building_id (uuid → buildings)
  unit_number (text)
  sq_footage (int)
  created_at (timestamptz)

utility_bills
  id (uuid PK)
  household_id (uuid → households)
  billing_period_start / _end (date)
  kwh_used (numeric)
  total_cost (numeric)
  rate_plan, utility_provider, account_last_four (text)
  raw_image_url (text)
  created_at (timestamptz)

insights
  id (uuid PK)
  household_id (uuid → households)
  insight_type (text)
  insight_value (text)
  generated_at (timestamptz)
```

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Supabase project
- An Anthropic API key

### 1. Clone and configure environment

```bash
git clone https://github.com/YOUR_USERNAME/wattwise.git
cd wattwise

# Copy and fill in env vars
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Run the Supabase migration

In your Supabase project → SQL Editor, paste and run:
```
backend/migrations/001_initial_schema.sql
```

Then create the storage bucket:
- Go to Supabase Storage → Create bucket → name it **`bills`** → set to private.

### 3. Start the backend

```bash
cd backend

# Create venv
python3 -m venv venv && source venv/bin/activate

# Install deps
pip install -r requirements.txt

# Copy env (FastAPI reads from .env in its working directory)
cp ../.env .env

# Run
uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

### 4. Start the frontend

```bash
cd frontend

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## API Reference

| Method | Endpoint                      | Description                                           |
|--------|-------------------------------|-------------------------------------------------------|
| GET    | `/health`                     | Health check                                          |
| POST   | `/upload-bill`                | Upload bill image/PDF + parse with Claude Vision      |
| GET    | `/bills/{household_id}`       | List all bills for a household (desc by date)         |
| GET    | `/insights/{household_id}`    | Generate and return energy insights                   |
| POST   | `/households`                 | Create a new household record                         |
| GET    | `/households/{household_id}`  | Fetch household + building details                    |

### POST /upload-bill

**Form fields:**
- `file` — JPG, PNG, GIF, WEBP, or PDF (max 10 MB)
- `household_id` — UUID of the household

**Response:**
```json
{
  "success": true,
  "household_id": "uuid",
  "bill": {
    "id": "uuid",
    "kwh_used": 485.3,
    "total_cost": 89.42,
    "billing_period_start": "2025-03-01",
    "billing_period_end": "2025-03-31",
    "utility_provider": "Pacific Gas & Electric",
    "rate_plan": "E-TOU-C",
    "account_last_four": "4821",
    "raw_image_url": "https://..."
  }
}
```

---

## Deployment

### Backend → Railway

1. Push repo to GitHub
2. New Railway project → Deploy from GitHub → select `wattwise/backend`
3. Set environment variables (same as `.env`)
4. Railway will auto-detect FastAPI — set start command:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend → Vercel

1. Import GitHub repo in Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```
4. Deploy.

---

## Insights Generated

| Type | Description |
|------|-------------|
| `avg_rate_vs_benchmark` | Your $/kWh vs US average ($0.16/kWh) |
| `mom_usage_change` | Month-over-month kWh change (%) |
| `estimated_annual_spend` | Projected annual cost from last 3 months |
| `overpaying_flag` | Alert if your rate is >20% above benchmark |

---

## License

MIT
