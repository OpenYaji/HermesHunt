import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest.scraper import scrape_url, ScraperError
from ingest.classifier import classify_requirements, ClassifierError

app = FastAPI(title="HermesHunt Ingest Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class IngestRequest(BaseModel):
    url: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ingest")
def ingest(req: IngestRequest):
    try:
        raw_text = scrape_url(req.url)
    except ScraperError as exc:
        raise HTTPException(status_code=422, detail=f"Scraper error: {exc}")

    try:
        requirements = classify_requirements(raw_text, req.url)
    except ClassifierError as exc:
        raise HTTPException(status_code=503, detail=f"Classifier error: {exc}")

    return requirements


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ingest.server:app", host="0.0.0.0", port=8001, reload=True, app_dir=".")
