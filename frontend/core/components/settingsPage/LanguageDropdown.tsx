"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

interface LanguageDropdownProps {
  value?: Language;
  onChange?: (lang: Language) => void;
  languages?: Language[];
}

export default function LanguageDropdown({
  value,
  onChange,
  languages = LANGUAGES,
}: LanguageDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Language>(value ?? languages[0]);
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
    if (value && value.code !== selected.code) {
      setSelected(value);
    }
  }, [value, selected.code]);

  function handleSelect(lang: Language) {
    setSelected(lang);
    setOpen(false);
    onChange?.(lang);
  }

  return (
    <div ref={rootRef} className="relative w-86 text-sm">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#343041] px-3.5 py-2.5 text-white transition-colors focus:ring-2 focus:ring-red-500/40"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="font-medium">{selected.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-white transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#14141c] py-1 shadow-xl shadow-black/40 overflow-y-auto no-scrollbar max-h-60"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === selected.code;
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-white/90 transition-colors hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
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
