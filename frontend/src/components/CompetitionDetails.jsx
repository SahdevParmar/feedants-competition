import { useState } from "react";
import {
  Info, Play, Shield, ShieldCheck, Megaphone,
  MessageCircle, Copy, ChevronDown, ChevronRight, Sparkles,
} from "lucide-react";

export default function CompetitionDetails({ competition, userState }) {
  const [activeTab, setActiveTab] = useState("about");
  const [expanded, setExpanded] = useState(false);

  const tabs = [
    { id: "about", label: "About Competition" },
    { id: "judging", label: "Judging Parameters" },
    { id: "rules", label: "Rules & Eligibility" },
  ];

  return (
    <div className="flex-col  justify-between shadow-md   border-gray-300 border-2 overflow-hidden  py-4 px-4 gap-2 rounded-xl  font-medium">
      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="flex border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${
              activeTab === tab.id ? "text-brand" : "text-slate-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────── */}
      <div className="p-4">
        {activeTab === "about" && (
          <div className="text-sm text-slate-600 leading-relaxed">
            <p className={expanded ? "" : "line-clamp-3"}>
              {competition.about}
            </p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-brand text-xs font-semibold mt-2 mx-auto"
            >
              {expanded ? "View less" : "View more"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}

        {activeTab === "judging" && (
          <ul className="space-y-2 text-sm text-slate-600">
            {competition.tabs?.judgingParameters?.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand mt-0.5">•</span> {p}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "rules" && (
          <ul className="space-y-2 text-sm text-slate-600">
            {competition.tabs?.rulesAndEligibility?.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand mt-0.5">•</span> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Rank icon — medal emoji for top 3, star for the rest
──────────────────────────────────────────────────── */
function RewardIcon({ rank }) {
  if (rank === 1) return <span className="text-base">🥇</span>;
  if (rank === 2) return <span className="text-base">🥈</span>;
  if (rank === 3) return <span className="text-base">🥉</span>;
  return <span className="text-base text-slate-400">☆</span>;
}