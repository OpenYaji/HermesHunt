export function validateJobUrl(url: string): string | null {
  if (!url.trim()) return "URL cannot be empty";
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "URL must use http or https";
    }
    if (!parsed.hostname.includes(".")) {
      return "Invalid hostname";
    }
    return null;
  } catch {
    return "Invalid URL format";
  }
}
