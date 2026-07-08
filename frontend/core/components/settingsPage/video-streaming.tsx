"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LanguageDropdown from "../../../core/components/settingsPage/LanguageDropdown";
import { LANGUAGES } from "../../../core/components/settingsPage/LanguageDropdown";
import QualityDropdown from "../../../core/components/settingsPage/QualityDropdown";
import { QUALITY_OPTIONS } from "../../../core/components/settingsPage/QualityDropdown";
import { useAuth } from "@/core/contexts/AuthContext";
import { updateVideoStreaming } from "@/core/lib/users";

export default function VideoStreaming() {
  const { user, refreshUser } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [selectedQuality, setSelectedQuality] = useState(QUALITY_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    const nextLanguage =
      LANGUAGES.find((language) => language.code === user.subtitlePreference) ??
      LANGUAGES[0];
    const nextQuality =
      QUALITY_OPTIONS.find(
        (quality) => quality.value === user.qualityPreference,
      ) ?? QUALITY_OPTIONS[0];

    setSelectedLanguage(nextLanguage);
    setSelectedQuality(nextQuality);
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCancel = () => {
    const nextLanguage =
      LANGUAGES.find(
        (language) => language.code === user?.subtitlePreference,
      ) ?? LANGUAGES[0];
    const nextQuality =
      QUALITY_OPTIONS.find(
        (quality) => quality.value === user?.qualityPreference,
      ) ?? QUALITY_OPTIONS[0];

    setSelectedLanguage(nextLanguage);
    setSelectedQuality(nextQuality);
    setError("");
    setSuccess("");
  };

  const hasChanges =
    selectedLanguage.code !== (user?.subtitlePreference ?? LANGUAGES[0].code) ||
    selectedQuality.value !==
      (user?.qualityPreference ?? QUALITY_OPTIONS[0].value);

  const handleSave = async () => {
    if (!hasChanges) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload: {
        subtitle?:
          | "en"
          | "fr"
          | "es"
          | "ar"
          | "de"
          | "it"
          | "pt"
          | "ru"
          | "zh"
          | "ja"
          | "ko"
          | "nl";
        quality?: "2160p" | "1080p" | "720p" | "480p";
      } = {};

      if (selectedLanguage.code !== (user?.subtitlePreference ?? LANGUAGES[0].code)) {
        payload.subtitle = selectedLanguage.code as typeof payload.subtitle;
      }

      if (selectedQuality.value !== (user?.qualityPreference ?? QUALITY_OPTIONS[0].value)) {
        payload.quality = selectedQuality.value as typeof payload.quality;
      }

      await updateVideoStreaming(payload);
      await refreshUser();
      setSuccess("Video streaming preferences updated successfully!");
    } catch (err: unknown) {
      const responseData =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (err.response.data as { message?: string; error?: string })
          : undefined;

      setError(
        responseData?.message ||
        responseData?.error ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-11 p-5">
        <h1 className="text-white text-xl font-medium">Video & Streaming</h1>

        {success && (
          <div
            onClick={() => setSuccess("")}
            className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer"
          >
            <p className="text-green-400 text-[11px]">{success}</p>
            <X className="text-green-400" size={20} />
          </div>
        )}

        {error && (
          <div
            onClick={() => setError("")}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 cursor-pointer flex flex-row justify-between"
          >
            <p className="text-red-400 text-[11px]">{error}</p>
            <X className="text-red-400" size={20} />
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div className="flex flex-col xl:flex-row xl:justify-between gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-white text-[15px] font-regular">
                Subtitle Language
              </p>
              <p className="text-[#C2C2C2] text-xs font-regular">
                Select the default subtitle language you would like to use for
                your videos.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <LanguageDropdown
                value={selectedLanguage}
                onChange={setSelectedLanguage}
              />
            </div>
          </div>

          <hr className="border-[#454359]" />

          <div className="flex flex-col xl:flex-row xl:justify-between gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-white text-[15px] font-regular">
                Preferred Quality
              </p>
              <p className="text-[#C2C2C2] text-xs font-regular">
                Choose the default playback quality for videos when streaming
                starts.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <QualityDropdown
                value={selectedQuality}
                onChange={setSelectedQuality}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel & Save Buttons */}
      <div className="flex flex-col justify-end shrink-0">
        <hr className="border-[#454359] w-full" />
        <div className="flex justify-end gap-3 p-5">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-xl w-33.25 py-2 border border-[#EC4949] text-[#EC4949]  text-sm font-regular hover:bg-[#EC4949]/10 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="rounded-xl w-33.25 bg-[#EC4949] text-white  text-sm font-medium hover:bg-[#d63f3f] transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
