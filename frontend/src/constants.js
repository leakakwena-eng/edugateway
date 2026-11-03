export const APPLICATION_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
  "ENROLLED",
];

export const DOCUMENT_TYPES = [
  "Birth Certificate",
  "Proof of Residence",
  "Immunisation Record",
  "Parent/Guardian ID",
  "Transfer Letter",
  "Report Card",
];

export const GRADES = [
  "Grade R",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
];

export const ACCEPTED_FILE_TYPES = "application/pdf,image/jpeg,image/png";
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
