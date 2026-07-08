"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface QualityOption {
  value: string;
  label: string;
}

export const QUALITY_OPTIONS: QualityOption[] = [
  { value: "2160p", label: "2160p" },
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
  { value: "480p", label: "480p" },
];

interface QualityDropdownProps {
  value?: QualityOption;
  onChange?: (quality: QualityOption) => void;
  options?: QualityOption[];
}

export default function QualityDropdown({
  value,
  onChange,
  options = QUALITY_OPTIONS,
}: QualityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<QualityOption>(value ?? options[0]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (value && value.value !== selected.value) {
      setSelected(value);
    }
  }, [value, selected.value]);

  function handleSelect(quality: QualityOption) {
    setSelected(quality);
    setOpen(false);
    onChange?.(quality);
  }

  return (
    <div ref={rootRef} className="relative w-86 text-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#343041] px-3.5 py-2.5 text-white transition-colors focus:ring-2 focus:ring-red-500/40"
      >
        <span className="font-medium">{selected.label}</span>
        <ChevronDown
          size={16}
          className={`text-white transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#14141c] py-1 shadow-xl shadow-black/40"
        >
          {options.map((quality) => {
            const isSelected = quality.value === selected.value;
            return (
              <li key={quality.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(quality)}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-white/90 transition-colors hover:bg-white/5"
                >
                  <span>{quality.label}</span>
                  {isSelected && <Check size={15} className="text-red-500" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
