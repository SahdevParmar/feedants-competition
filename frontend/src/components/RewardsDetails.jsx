import { useState } from "react";
import {
  Info, Play, Shield, ShieldCheck, Megaphone,
  MessageCircle, ChevronDown, ChevronRight,
} from "lucide-react";

export default function RewardDetails({
  competition,
  userState,
  state,
  registering,
  onRegister,
}) {
  const [expanded, setExpanded] = useState(false);

  // Button label depends on lifecycle state + user state
  const getCtaLabel = () => {
    if (registering) return "Registering…";
    if (userState?.isRegistered) {
      if (state === "SUBMISSION_PHASE") return "Upload Submission";
      if (state === "JUDGING") return "Under Review";
      if (state === "RESULTS_PUBLISHED") return "View Results";
      return "Registered";
    }
    if (state === "FULL") return "Slots Full";
    if (state === "REGISTRATION_OPEN") return "Register Now";
    if (state === "SUBMISSION_PHASE") return "Registration Closed";
    if (state === "JUDGING") return "Under Review";
    if (state === "RESULTS_PUBLISHED") return "Competition Ended";
    return "Register Now";
  };

  const canClick = !registering && (
    userState?.isRegistered ||
    (state === "REGISTRATION_OPEN" && userState?.canRegister)
  );

  return (
    <div className="flex-col justify-between shadow-md grow max-w-120 border-gray-300 border-2 overflow-hidden py-4 px-4 gap-2 rounded-xl font-medium">
      {/* Rewards */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">Rewards</h3>
          <span className="text-xs text-slate-400">(All Positions)</span>
        </div>
        <ul className="space-y-2">
          {competition.rewards.map((r) => (
            <li key={r.rank} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <RewardIcon rank={r.rank} />
                <span className="text-slate-700">{r.description}</span>
              </div>
              <span className="font-semibold text-brand">₹ {r.cashValue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mb-3 flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-lg p-3">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-xs text-sky-900">
          <span className="font-semibold">Disclaimer:</span> Only contributions
          from paid participants will be considered for judging.
        </p>
      </div>

      {/* Two-column info block */}
      <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
          <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-brand fill-brand ml-0.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              How will you receive prize money?
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Watch video to know more
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-700">Refund policy</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] text-slate-600">
              Secure payments powered by
            </span>
            <span className="text-[10px] font-bold text-slate-800">Razorpay</span>
          </div>
        </div>
      </div>

      {/* Referral card */}
      <div className="mx-4 mb-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
        <div className="flex items-start gap-3 mb-3">
          <Megaphone className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="text-sm font-bold text-slate-800">
            Refer &amp; Earn more discount
          </p>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-500 truncate">
            {competition.referral?.baseUrl || "https://feedants.com/r/referral123"}
          </div>
          <button
            onClick={() =>
              competition.referral?.baseUrl &&
              navigator.clipboard.writeText(competition.referral.baseUrl)
            }
            className="px-4 py-2 text-xs font-semibold text-brand border border-brand rounded-md hover:bg-brand hover:text-white transition"
          >
            Copy Link
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="px-4 py-1.5 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand-dark transition">
            Refer Now
          </button>
          <p className="text-[10px] text-slate-600">
            You earn <span className="font-bold text-slate-800">₹10</span> for every signup
          </p>
        </div>
      </div>

      {/* Hear From Our Users */}
      <button className="w-full mx-4 mb-3 flex items-center justify-between bg-white border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">Hear From Our Users</p>
            <p className="text-[10px] text-slate-500">
              See what participants say about Feedants
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onRegister}
          disabled={!canClick}
          className="w-full bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getCtaLabel()}
        </button>
        {userState?.isRegistered && (
          <p className="text-center text-[10px] text-brand mt-1 font-semibold">
            Registered
          </p>
        )}
      </div>
    </div>
  );
}

function RewardIcon({ rank }) {
  if (rank === 1) return <span className="text-base">🥇</span>;
  if (rank === 2) return <span className="text-base">🥈</span>;
  if (rank === 3) return <span className="text-base">🥉</span>;
  return <span className="text-base text-slate-400">☆</span>;
}