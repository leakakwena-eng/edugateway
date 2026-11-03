// Presentation helpers: the API speaks in enum codes and ISO dates; the UI shows labels.

const STATUS_LABELS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WAITLISTED: "Waitlisted",
  ENROLLED: "Enrolled",
  PENDING: "Pending",
  VERIFIED: "Verified",
  RELEASED: "Released",
};

export const statusLabel = (code) => STATUS_LABELS[code] ?? code ?? "—";

export const typeLabel = (type) => (type === "TRANSFER" ? "Transfer" : "New Admission");

export const schoolTypeLabel = (type) =>
  type ? type.charAt(0) + type.slice(1).toLowerCase() : "—";

const ACTION_LABELS = {
  APPLICATION_SUBMITTED: "Application submitted",
  TRANSFER_REQUESTED: "Transfer requested",
  REVIEW_STARTED: "Review started",
  DECISION_ACCEPTED: "Application accepted",
  DECISION_WAITLISTED: "Application waitlisted",
  DECISION_REJECTED: "Application rejected",
  DOCUMENT_UPLOADED: "Document uploaded",
  DOCUMENT_VERIFIED: "Document verified",
  DOCUMENT_REJECTED: "Document rejected",
  TRANSFER_RECORDS_RELEASED: "Transfer records released",
  LEARNER_ENROLLED: "Learner enrolled",
  LEARNER_ADDED: "Learner added",
  LEARNER_UPDATED: "Learner updated",
  INTAKE_CREATED: "Intake created",
  INTAKE_UPDATED: "Intake updated",
  SCHOOL_CREATED: "School added",
  GUARDIAN_REGISTERED: "Guardian registered",
};

export const actionLabel = (code) =>
  ACTION_LABELS[code] ??
  (code || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

const dateFmt = new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-ZA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const parse = (iso) => (iso ? new Date(iso) : null);

export const formatDate = (iso) => (iso ? dateFmt.format(parse(iso)) : "—");
export const formatDateTime = (iso) => (iso ? dateTimeFmt.format(parse(iso)) : "—");

/** "Today, 09:22" / "Yesterday, 16:40" / "10 Jan 2027" */
export function formatRelative(iso) {
  if (!iso) return "";
  const d = parse(iso);
  const today = new Date();
  const days = Math.floor(
    (new Date(today.toDateString()) - new Date(d.toDateString())) / 86_400_000
  );
  const time = d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return formatDate(iso);
}

export function formatBytes(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const errorMessage = (e) => e?.message || "Something went wrong";
