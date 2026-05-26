import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import bills, insights, households

app = FastAPI(
    title="WattWise API",
    description="Energy intelligence backend — bill parsing, insights, and household management.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow all origins so any Vercel/local frontend can reach the API.
# Tighten this to specific domains once you have a stable production URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
