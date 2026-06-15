const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const paychexDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function isIsoDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
  );
}

export function compareIsoDates(a: string, b: string) {
  return a.localeCompare(b);
}

export function getWeekdayIsoDates(startDate: string, endDate: string) {
  const dates: string[] = [];
  const current = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  while (current <= end) {
    const day = current.getUTCDay();
    if (day !== 0 && day !== 6) {
      dates.push(toIsoDate(current));
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

export function formatPaychexDateLabel(isoDate: string) {
  // Paychex rows currently display dates like "Jun 8".
  return dateFormatter.format(parseIsoDate(isoDate));
}

export function parsePaychexPayPeriod(startLabel: string, endLabel: string) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentYearStart = parsePaychexDateLabel(startLabel, currentYear);
  const currentYearEnd = parsePaychexDateLabel(endLabel, currentYear);
  const todayIso = toIsoDate(today);

  const candidateRanges = [
    normalizePayPeriod(currentYearStart, currentYearEnd),
    normalizePayPeriod(
      parsePaychexDateLabel(startLabel, currentYear - 1),
      parsePaychexDateLabel(endLabel, currentYear - 1),
    ),
    normalizePayPeriod(
      parsePaychexDateLabel(startLabel, currentYear + 1),
      parsePaychexDateLabel(endLabel, currentYear + 1),
    ),
  ];

  return (
    candidateRanges.find(
      (range) =>
        compareIsoDates(range.startDate, todayIso) <= 0 &&
        compareIsoDates(todayIso, range.endDate) <= 0,
    ) ?? candidateRanges[0]
  );
}

function normalizePayPeriod(start: Date, end: Date) {
  if (end < start) {
    end.setUTCFullYear(end.getUTCFullYear() + 1);
  }

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}

function parsePaychexDateLabel(label: string, year: number) {
  const parsed = new Date(`${label} ${year} 00:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Could not parse pay period date: ${label}`);
  }

  if (paychexDateFormatter.format(parsed) !== label.trim()) {
    throw new Error(`Could not parse pay period date: ${label}`);
  }

  return parsed;
}

function parseIsoDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
