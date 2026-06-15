const dateFormatter = new Intl.DateTimeFormat("en-US", {
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

function parseIsoDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
