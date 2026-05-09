import { describe, it, expect } from "vitest";
import { validateDateField, validateExperience, validateSkillName } from "./validation";

describe("validateDateField", () => {
  it("accepts valid MM/YYYY dates", () => {
    expect(validateDateField("06/2022")).toBeNull();
    expect(validateDateField("01/2000")).toBeNull();
    expect(validateDateField("12/2025")).toBeNull();
  });
  it("accepts 'Present'", () => {
    expect(validateDateField("Present")).toBeNull();
  });
  it("rejects bad formats", () => {
    expect(validateDateField("2022-06")).not.toBeNull();
    expect(validateDateField("13/2022")).not.toBeNull();
    expect(validateDateField("6/2022")).not.toBeNull();
    expect(validateDateField("")).not.toBeNull();
  });
});

describe("validateExperience", () => {
  const valid = { role: "Engineer", company: "Acme", start_date: "01/2022", end_date: "Present" };
  it("passes valid data", () => {
    expect(validateExperience(valid)).toEqual({});
  });
  it("catches empty role", () => {
    expect(validateExperience({ ...valid, role: "" })).toHaveProperty("role");
  });
  it("catches bad start_date", () => {
    expect(validateExperience({ ...valid, start_date: "not-a-date" })).toHaveProperty("start_date");
  });
});

describe("validateSkillName", () => {
  it("accepts valid skill names", () => {
    expect(validateSkillName("React")).toBeNull();
    expect(validateSkillName("TypeScript")).toBeNull();
  });
  it("rejects empty strings", () => {
    expect(validateSkillName("")).not.toBeNull();
    expect(validateSkillName("   ")).not.toBeNull();
  });
  it("rejects names over 60 chars", () => {
    expect(validateSkillName("a".repeat(61))).not.toBeNull();
  });
});
