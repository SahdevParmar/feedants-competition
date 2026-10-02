// src/components/IsoDateconverter.js

export default function IsoDateconverter(isoString) {
  if (!isoString) return { day: "", month: "", year: "", time: "N/A" };

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return { day: "", month: "", year: "", time: "Invalid Date" };
  }

  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const year = new Intl.DateTimeFormat("en", { year: "2-digit" }).format(date);

  const time = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return { day, month, year, time, fullDate: `${day} ${month} ${year}` };
}
