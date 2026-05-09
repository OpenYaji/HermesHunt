import json
import pytest
import httpx
from unittest.mock import patch, MagicMock

from ingest.scraper import scrape_url, extract_text_from_html, ScraperError


def _mock_response(status_code: int = 200, text: str = "") -> MagicMock:
    mock = MagicMock()
    mock.status_code = status_code
    mock.text = text
    return mock


class TestExtractTextFromHtml:
    def test_extracts_json_ld_job_posting(self):
        payload = json.dumps({
            "@type": "JobPosting",
            "title": "Senior Engineer",
            "description": "Build great software using Python and AWS.",
        })
        html = f'<html><body><script type="application/ld+json">{payload}</script></body></html>'
        result = extract_text_from_html(html)
        assert "Senior Engineer" in result
        assert "Build great software" in result

    def test_strips_nav_header_footer(self):
        html = """<html><body>
        <nav>Menu links here</nav>
        <header>Site header</header>
        <main><p>We need a React developer with 5 years experience.</p></main>
        <footer>Copyright 2026</footer>
        </body></html>"""
        result = extract_text_from_html(html)
        assert "React developer" in result
        assert "Menu links here" not in result
        assert "Site header" not in result
        assert "Copyright 2026" not in result

    def test_falls_back_to_body_content(self):
        html = "<html><body><p>We are hiring a TypeScript developer with 3 years experience.</p></body></html>"
        result = extract_text_from_html(html)
        assert "TypeScript developer" in result

    def test_truncates_at_8000_chars(self):
        long_body = "word " * 2000  # 10000 chars
        html = f"<html><body>{long_body}</body></html>"
        result = extract_text_from_html(html)
        assert len(result) <= 8000


class TestScrapeUrl:
    def test_returns_text_on_successful_scrape(self):
        content = "Python developer needed. " * 30
        html = f"<html><body><main>{content}</main></body></html>"
        with patch("ingest.scraper.httpx.get", return_value=_mock_response(200, html)):
            result = scrape_url("https://example.com/job/123")
        assert "Python developer needed" in result

    def test_raises_scraper_error_on_timeout(self):
        with patch("ingest.scraper.httpx.get", side_effect=httpx.TimeoutException("")):
            with pytest.raises(ScraperError, match="timed out"):
                scrape_url("https://example.com/job/123")

    def test_raises_scraper_error_on_403(self):
        with patch("ingest.scraper.httpx.get", return_value=_mock_response(403)):
            with pytest.raises(ScraperError, match="403"):
                scrape_url("https://example.com/job/123")

    def test_raises_scraper_error_on_429(self):
        with patch("ingest.scraper.httpx.get", return_value=_mock_response(429)):
            with pytest.raises(ScraperError, match="Rate limited"):
                scrape_url("https://example.com/job/123")

    def test_raises_scraper_error_on_generic_4xx(self):
        with patch("ingest.scraper.httpx.get", return_value=_mock_response(404)):
            with pytest.raises(ScraperError, match="HTTP 404"):
                scrape_url("https://example.com/job/123")

    def test_raises_scraper_error_on_empty_content(self):
        with patch("ingest.scraper.httpx.get", return_value=_mock_response(200, "<html><body></body></html>")):
            with pytest.raises(ScraperError, match="meaningful content"):
                scrape_url("https://example.com/job/123")

    def test_raises_scraper_error_on_network_failure(self):
        with patch("ingest.scraper.httpx.get", side_effect=httpx.RequestError("connection refused")):
            with pytest.raises(ScraperError, match="Network error"):
                scrape_url("https://example.com/job/123")
