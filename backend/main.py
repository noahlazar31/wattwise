from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import bills, insights, households

settings = get_settings()

app = FastAPI(
    title="WattWise API",
    description="Energy intelligence backend — bill parsing, insights, and household management.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the Next.js frontend and Vercel deployments
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
if settings.environment == "production":
    # Add your production Vercel URL here or read from env
    import os
    vercel_url = os.getenv("FRONTEND_URL", "")
    if vercel_url:
        origins.append(vercel_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(bills.router, tags=["Bills"])
app.include_router(insights.router, tags=["Insights"])
app.include_router(households.router, tags=["Households"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "WattWise API", "version": "1.0.0"}
