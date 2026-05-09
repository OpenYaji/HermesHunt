const DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

export function validateDateField(date: string): string | null {
  if (date === "Present") return null;
  if (!DATE_REGEX.test(date)) return "Use MM/YYYY format (e.g. 06/2022)";
  return null;
}

export function validateExperience(data: {
  role: string;
  company: string;
  start_date: string;
  end_date: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.role.trim())    errors.role    = "Role is required";
  if (!data.company.trim()) errors.company = "Company is required";
  const startErr = validateDateField(data.start_date);
  if (startErr)             errors.start_date = startErr;
  const endErr   = validateDateField(data.end_date);
  if (endErr)               errors.end_date   = endErr;
  return errors;
}

export function validateProject(data: { name: string }): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Project name is required";
  return errors;
}

export function validateSkillName(name: string): string | null {
  if (!name.trim())     return "Skill name cannot be empty";
  if (name.length > 60) return "Skill name too long (60 chars max)";
  return null;
}
