import json
import httpx
from bs4 import BeautifulSoup

STEALTH_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

CONTENT_KEYWORDS = ("job", "description", "content", "posting", "listing", "details")


class ScraperError(Exception):
    pass


def _has_content_hint(value: object) -> bool:
    if value is None:
        return False
    text = " ".join(value) if isinstance(value, list) else str(value)
    return any(k in text.lower() for k in CONTENT_KEYWORDS)


def extract_text_from_html(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    # Try JSON-LD JobPosting first (LinkedIn, Indeed, Greenhouse use this)
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
            if isinstance(data, dict) and data.get("@type") in ("JobPosting", "jobPosting"):
                org = data.get("hiringOrganization", {})
                parts = [
                    data.get("title", ""),
                    org.get("name", "") if isinstance(org, dict) else "",
                    data.get("description", ""),
                ]
                text = "\n\n".join(p for p in parts if p)
                if text.strip():
                    return text[:8000]
        except (json.JSONDecodeError, AttributeError):
            continue

    # Strip non-content elements
    for tag in soup(["script", "style", "nav", "header", "footer", "aside", "iframe", "noscript"]):
        tag.decompose()

    # Find the most relevant content container
    main = (
        soup.find("main")
        or soup.find(id=_has_content_hint)
        or soup.find(class_=_has_content_hint)
        or soup.find("body")
    )

    return (main or soup).get_text(separator="\n", strip=True)[:8000]


def scrape_url(url: str, timeout: int = 15) -> str:
    try:
        response = httpx.get(url, headers=STEALTH_HEADERS, timeout=timeout, follow_redirects=True)
    except httpx.TimeoutException:
        raise ScraperError("Request timed out")
    except httpx.RequestError as exc:
        raise ScraperError(f"Network error: {exc}")

    if response.status_code == 403:
        raise ScraperError(
            "Access denied (403). The site may require login or have bot protection."
        )
    if response.status_code == 429:
        raise ScraperError("Rate limited (429). Try again in a few minutes.")
    if response.status_code >= 400:
        raise ScraperError(f"HTTP {response.status_code} from {url}")

    text = extract_text_from_html(response.text)
    if len(text.strip()) < 100:
        raise ScraperError("Could not extract meaningful content from the page.")

    return text
