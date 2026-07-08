"use client";

import { useState } from "react";
import {
  CircleUserRound,
  Settings,
  TvMinimalPlay,
  Menu,
  X,
} from "lucide-react";
import MyProfile from "../../../core/components/settingsPage/my-profile";
import SecurityPrivacy from "../../../core/components/settingsPage/security-privacy";
import VideoStreaming from "../../../core/components/settingsPage/video-streaming";

export default function SettingsPage() {
  const SETTINGS = [
    { name: "My Profile", Icon: CircleUserRound },
    { name: "Security & Privacy", Icon: Settings },
    { name: "Video & Streaming", Icon: TvMinimalPlay },
  ];

  const [selectedSetting, setSelectedSetting] = useState(SETTINGS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className=" h-full w-full flex lg:gap-3">
      {/* LEFT SIDEBAR */}
      <div
        className={`${
          isSidebarOpen ? "w-full h-full flex" : "hidden"
        } lg:flex lg:relative lg:w-[270px] lg:h-full bg-[#25242c] rounded-xl p-5 flex-col justify-between`}
      >
        <div className="flex flex-col gap-4 ">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-white text-[15px] font-regular">Account</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-[#8e8d9c] hover:text-white p-1 hover:bg-[#343041] rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-4 pl-2">
            {SETTINGS.map((setting) => (
              <div
                key={setting.name}
                onClick={() => {
                  setSelectedSetting(setting);
                  setIsSidebarOpen(false);
                }}
                className={`flex gap-3 items-center py-3 px-3 rounded-2xl cursor-pointer ${
                  selectedSetting.name === setting.name
                    ? "bg-[#343041]"
                    : "hover:bg-white/2"
                }`}
              >
                <setting.Icon className="text-white" size={20} />
                <span className="text-white text-[16px] font-regular">
                  {setting.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 h-full overflow-hidden bg-[#25242c] rounded-xl flex flex-col min-h-0">
        {/* Breadcrumbs */}
        <div className="px-5 pt-5 pb-1 flex items-center gap-2 text-xs lg:text-sm text-[#8e8d9c] font-medium tracking-wide shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-[#8e8d9c] hover:text-white mr-1 transition-colors duration-200 p-1 hover:bg-[#343041] rounded-lg flex items-center justify-center shrink-0"
          >
            <Menu size={18} />
          </button>
          <span
            onClick={() => setSelectedSetting(SETTINGS[0])}
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Settings
          </span>
          <span className="text-[#454359]">/</span>
          <span className="text-white font-semibold">
            {selectedSetting.name}
          </span>
        </div>

        <div className="flex-1 min-h-0">
          {selectedSetting.name == "My Profile" && <MyProfile />}
          {selectedSetting.name == "Security & Privacy" && <SecurityPrivacy />}
          {selectedSetting.name == "Video & Streaming" && <VideoStreaming />}
        </div>
      </div>
    </div>
  );
}
