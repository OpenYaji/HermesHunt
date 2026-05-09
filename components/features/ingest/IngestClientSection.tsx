"use client";

import { useState } from "react";
import { IngestForm, type IngestResult } from "./IngestForm";
import { RequirementsCard } from "./RequirementsCard";

export function IngestClientSection() {
  const [result, setResult] = useState<IngestResult | null>(null);

  return (
    <div>
      <IngestForm onResult={setResult} />
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <RequirementsCard result={result} onSaved={() => setResult(null)} />
        </div>
      )}
    </div>
  );
}
