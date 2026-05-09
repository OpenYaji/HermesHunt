import json
import pytest
import httpx
from unittest.mock import patch, MagicMock

from ingest.classifier import classify_requirements, ClassifierError


def _mock_ollama(response_json: dict) -> MagicMock:
    mock = MagicMock()
    mock.status_code = 200
    mock.json.return_value = {"response": json.dumps(response_json)}
    return mock


VALID_CLASSIFICATION = {
    "title": "Senior Software Engineer",
    "company": "Acme Corp",
    "required_years_experience": 5,
    "prioritized_acronyms": ["Python", "AWS", "Docker", "K8s"],
    "signals": [
        "5+ years Python experience",
        "AWS cloud infrastructure experience",
        "Docker and Kubernetes proficiency",
        "Remote-friendly team",
    ],
}


class TestClassifyRequirements:
    def test_returns_all_required_fields(self):
        with patch("ingest.classifier.httpx.post", return_value=_mock_ollama(VALID_CLASSIFICATION)):
            result = classify_requirements("some job description text", "https://example.com/job")

        assert result["title"] == "Senior Software Engineer"
        assert result["company"] == "Acme Corp"
        assert result["required_years_experience"] == 5
        assert "Python" in result["prioritized_acronyms"]
        assert len(result["signals"]) == 4
        assert result["url"] == "https://example.com/job"
        assert "extracted_at" in result

    def test_handles_missing_optional_fields_with_defaults(self):
        sparse = {"title": "Engineer"}
        with patch("ingest.classifier.httpx.post", return_value=_mock_ollama(sparse)):
            result = classify_requirements("text", "https://example.com/job")

        assert result["title"] == "Engineer"
        assert result["company"] == ""
        assert result["required_years_experience"] == 0
        assert result["prioritized_acronyms"] == []
        assert result["signals"] == []

    def test_raises_classifier_error_when_ollama_unreachable(self):
        with patch("ingest.classifier.httpx.post", side_effect=httpx.RequestError("connection refused")):
            with pytest.raises(ClassifierError, match="Ollama"):
                classify_requirements("text", "https://example.com/job")

    def test_raises_classifier_error_on_non_200_status(self):
        mock = MagicMock()
        mock.status_code = 503
        with patch("ingest.classifier.httpx.post", return_value=mock):
            with pytest.raises(ClassifierError, match="HTTP 503"):
                classify_requirements("text", "https://example.com/job")

    def test_raises_classifier_error_on_invalid_json_response(self):
        mock = MagicMock()
        mock.status_code = 200
        mock.json.return_value = {"response": "this is not json at all }{"}
        with patch("ingest.classifier.httpx.post", return_value=mock):
            with pytest.raises(ClassifierError, match="parse"):
                classify_requirements("text", "https://example.com/job")

    def test_coerces_years_experience_to_int(self):
        data = {**VALID_CLASSIFICATION, "required_years_experience": "3"}
        with patch("ingest.classifier.httpx.post", return_value=_mock_ollama(data)):
            result = classify_requirements("text", "https://example.com/job")
        assert result["required_years_experience"] == 3
        assert isinstance(result["required_years_experience"], int)
