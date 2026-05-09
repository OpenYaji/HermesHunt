import { describe, it, expect } from "vitest";
import { validateJobUrl } from "./validation";

describe("validateJobUrl", () => {
  it("accepts valid https job board URLs", () => {
    expect(validateJobUrl("https://jobs.lever.co/acme/123")).toBeNull();
    expect(validateJobUrl("https://linkedin.com/jobs/view/123")).toBeNull();
    expect(validateJobUrl("https://greenhouse.io/jobs/acme/123")).toBeNull();
  });

  it("accepts valid http URLs", () => {
    expect(validateJobUrl("http://example.com/jobs/123")).toBeNull();
  });

  it("rejects empty and whitespace-only strings", () => {
    expect(validateJobUrl("")).not.toBeNull();
    expect(validateJobUrl("   ")).not.toBeNull();
  });

  it("rejects non-http protocols", () => {
    expect(validateJobUrl("ftp://example.com/job")).not.toBeNull();
    expect(validateJobUrl("javascript:alert(1)")).not.toBeNull();
    expect(validateJobUrl("file:///etc/passwd")).not.toBeNull();
  });

  it("rejects malformed URLs", () => {
    expect(validateJobUrl("not a url")).not.toBeNull();
    expect(validateJobUrl("://missing-protocol")).not.toBeNull();
    expect(validateJobUrl("https://")).not.toBeNull();
  });
});
