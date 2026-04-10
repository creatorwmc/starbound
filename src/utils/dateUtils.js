// Date formatting and timeline helpers

export function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatFullDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// Generate all dates between two date strings (YYYY-MM-DD)
export function generateDateRange(firstDate, lastDate) {
  if (!firstDate || !lastDate) return [];
  const days = [];
  const start = new Date(firstDate + "T00:00:00Z");
  const end = new Date(lastDate + "T00:00:00Z");
  const current = new Date(start);
  while (current <= end) {
    days.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (!days.includes(today)) days.push(today);
  return days;
}
