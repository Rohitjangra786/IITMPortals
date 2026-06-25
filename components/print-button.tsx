"use client";

import { Button } from "./ui";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="no-print">
      Print / Save as PDF
    </Button>
  );
}
