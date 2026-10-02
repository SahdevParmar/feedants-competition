import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Countdown hook ────────────────────────────────────────
// Returns { days, hours, minutes, seconds, expired }.
// If target is null or in the past, returns zeros with expired: true.
function useCountdown(target) {
  const compute = () => {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    const diff = new Date(target).getTime() - Date.now();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
      expired: false,
    };
  };

  const [time, setTime] = useState(compute);

  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

// ─── Banner ────────────────────────────────────────────────
export default function CountdownBanner({ state, dates }) {
  // Pick target date + label based on lifecycle state
  let target = null;
  let label = "";
  let staticLabel = null;

  switch (state) {
    case "REGISTRATION_OPEN":
      target = dates?.registrationCloses;
      label = "Registration Closes in";
      staticLabel = "Registration Closed";
      break;
    case "SUBMISSION_PHASE":
      target = dates?.submissionEnds;
      label = "Submission Ends in";
      staticLabel = "Submissions Ended";
      break;
    case "JUDGING":
      target = dates?.resultDate;
      label = "Results in";
      staticLabel = "Results Coming Soon";
      break;
    case "FULL":
      staticLabel = "Slots Full";
      break;
    case "RESULTS_PUBLISHED":
      staticLabel = "Results Announced";
      break;
    default:
      target = dates?.registrationCloses;
      label = "Registration Closes in";
      staticLabel = "Registration Closed";
  }

  const { days, hours, minutes, seconds, expired } = useCountdown(target);
  const pad = (n) => String(n).padStart(2, "0");

  // States with no countdown, or expired countdown → show static label
  if (staticLabel && (!target || expired)) {
    return (
      <div className="flex items-center gap-2 justify-center text-sm md:flex-col w-full">
        <span className="font-semibold text-brand">{staticLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-around text-sm md:flex-col w-full">
      <span className="font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-2 tabular-nums">
        <Timer className="w-4 h-4 text-brand" />
        <span className="font-bold">{pad(days)}D</span>
        <span className="font-bold">{pad(hours)}H</span>
        <span className="font-bold">{pad(minutes)}M</span>
        <span className="font-bold">{pad(seconds)}S</span>
      </div>
    </div>
  );
}