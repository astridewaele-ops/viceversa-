"use client";

import { FieldLabel } from "./FieldLabel";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cargo-input"
        placeholder={placeholder}
      />
    </div>
  );
}
