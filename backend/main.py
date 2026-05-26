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

# CORS — read origins lazily from env so startup never crashes on missing vars
_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
_frontend_url = os.getenv("FRONTEND_URL", "")
if _frontend_url:
    _origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
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
