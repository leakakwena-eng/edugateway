// Thin fetch wrapper: adds the bearer token, parses JSON, and turns error
// responses ({"error": "..."}) into ApiError so callers can show the message.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const TOKEN_KEY = "edugateway_token";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let unauthorizedHandler = () => {};

/** Called when the server rejects our token, so the app can sign the user out. */
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage unavailable (private mode): the session just won't survive a reload.
    }
  },
};

async function request(method, path, { body, form, raw } = {}) {
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form; // browser sets the multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, "Cannot reach the EduGateway server. Check that the backend is running.");
  }

  if (res.status === 401 && token) {
    unauthorizedHandler();
  }
  if (!res.ok) {
    let message = res.statusText || "Request failed";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // Non-JSON error body; keep the status text.
    }
    throw new ApiError(res.status, message);
  }

  if (raw) return res;
  if (res.status === 204) return null;
  return res.json();
}

export const http = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, { body }),
  put: (path, body) => request("PUT", path, { body }),
  patch: (path, body) => request("PATCH", path, { body }),
  upload: (path, form) => request("POST", path, { form }),
  blob: (path) => request("GET", path, { raw: true }).then((r) => r.blob()),
};
