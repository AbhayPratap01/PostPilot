
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="Automated Multi-Platform Posting System",
    description="Automated social media publishing API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                  "https://post-pilot-lac.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Multi-Platform Posting API is running",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(router)
