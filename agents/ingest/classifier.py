import json
import httpx
from datetime import datetime, timezone

OLLAMA_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2"

_PROMPT_TEMPLATE = """You are a job requirements extractor. Given the job description below, extract the following fields and return them as a single JSON object.

Fields to extract:
- "title": the exact job title as written in the posting (string)
- "company": the company name (string, empty string if not found)
- "required_years_experience": minimum years of experience as an integer, 0 if not specified
- "prioritized_acronyms": list of technology/tool acronyms ordered by how frequently they appear (e.g. ["Python", "AWS", "Docker", "CI/CD"])
- "signals": list of up to 8 most important requirements, each under 15 words

Rules:
- Use the EXACT job title from the posting, do not paraphrase
- Only include real tech acronyms in prioritized_acronyms, not soft skills
- Respond with ONLY valid JSON. No markdown fences, no explanation.

Job description:
{text}"""


class ClassifierError(Exception):
    pass


def classify_requirements(raw_text: str, url: str) -> dict:
    prompt = _PROMPT_TEMPLATE.format(text=raw_text[:5000])

    try:
        response = httpx.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json",
            },
            timeout=90.0,
        )
    except httpx.RequestError as exc:
        raise ClassifierError(
            f"Cannot reach Ollama at {OLLAMA_URL}: {exc}. Is Ollama running? Try: ollama serve"
        )

    if response.status_code != 200:
        raise ClassifierError(f"Ollama returned HTTP {response.status_code}")

    try:
        raw_response = response.json().get("response", "")
        data = json.loads(raw_response)
    except (json.JSONDecodeError, KeyError) as exc:
        raise ClassifierError(f"Could not parse Ollama response as JSON: {exc}")

    return {
        "title": str(data.get("title", "")),
        "company": str(data.get("company", "")),
        "url": url,
        "required_years_experience": int(data.get("required_years_experience", 0) or 0),
        "prioritized_acronyms": [str(a) for a in data.get("prioritized_acronyms", [])],
        "signals": [str(s) for s in data.get("signals", [])],
        "extracted_at": datetime.now(timezone.utc).isoformat(),
    }
