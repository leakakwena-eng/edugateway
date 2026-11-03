// One function per backend endpoint. Pages import from here, never call fetch directly.
import { http } from "./client.js";

const query = (params) => {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return q ? `?${q}` : "";
};

export const authApi = {
  login: (email, password) => http.post("/auth/login", { email, password }),
  register: (data) => http.post("/auth/register", data),
  me: () => http.get("/auth/me"),
};

export const guardianApi = {
  list: () => http.get("/guardians"),
  updateProfile: (data) => http.put("/guardians/me", data),
};

export const schoolApi = {
  list: () => http.get("/schools"),
  create: (data) => http.post("/schools", data),
};

export const learnerApi = {
  list: () => http.get("/learners"),
  create: (data) => http.post("/learners", data),
  update: (id, data) => http.put(`/learners/${id}`, data),
};

export const intakeApi = {
  list: ({ schoolId, open } = {}) => http.get(`/intakes${query({ schoolId, open })}`),
  get: (id) => http.get(`/intakes/${id}`),
  create: (data) => http.post("/intakes", data),
  update: (id, data) => http.put(`/intakes/${id}`, data),
};

export const applicationApi = {
  list: (status) => http.get(`/applications${query({ status })}`),
  get: (id) => http.get(`/applications/${id}`),
  submit: (learnerId, intakeId) => http.post("/applications", { learnerId, intakeId }),
  startReview: (id) => http.post(`/applications/${id}/review`),
  decide: (id, decision, reason) => http.post(`/applications/${id}/decision`, { decision, reason }),
  enrol: (id) => http.post(`/applications/${id}/enrol`),
  saveNotes: (id, notes) => http.put(`/applications/${id}/notes`, { notes }),
  uploadDocument: (id, type, file) => {
    const form = new FormData();
    form.append("type", type);
    form.append("file", file);
    return http.upload(`/applications/${id}/documents`, form);
  },
};

export const documentApi = {
  list: () => http.get("/documents"),
  review: (id, status, reason) => http.patch(`/documents/${id}`, { status, reason }),
  /** Fetches the file with the auth header and opens it in a new tab. */
  open: async (id) => {
    const tab = window.open("", "_blank");
    const blob = await http.blob(`/documents/${id}/file`);
    const url = URL.createObjectURL(blob);
    if (tab) tab.location.href = url;
    else window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },
};

export const transferApi = {
  list: () => http.get("/transfers"),
  get: (id) => http.get(`/transfers/${id}`),
  release: (id) => http.post(`/transfers/${id}/release`),
};

export const notificationApi = {
  list: () => http.get("/notifications"),
  markRead: (id) => http.post(`/notifications/${id}/read`),
  markAllRead: () => http.post("/notifications/read-all"),
};

export const reportApi = {
  summary: (year) => http.get(`/reports/summary${query({ year })}`),
  schools: () => http.get("/reports/schools"),
  audit: (limit = 100) => http.get(`/reports/audit${query({ limit })}`),
};
