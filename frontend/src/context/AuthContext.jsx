import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/index.js";
import { onUnauthorized, tokenStore } from "../api/client.js";

const AuthContext = createContext(null);

/** Backend role → URL segment used by the router. */
export const ROLE_HOME = {
  GUARDIAN: "guardian",
  SCHOOL_ADMIN: "schoolAdmin",
  DISTRICT_ADMIN: "districtAdmin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  useEffect(() => onUnauthorized(logout), [logout]);

  // Restore the session from a saved token on first load.
  useEffect(() => {
    if (!tokenStore.get()) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStore.set(null))
      .finally(() => setRestoring(false));
  }, []);

  const startSession = useCallback(({ token, user }) => {
    tokenStore.set(token);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      restoring,
      home: user ? `/${ROLE_HOME[user.role]}` : "/login",
      login: (email, password) => authApi.login(email, password).then(startSession),
      register: (data) => authApi.register(data).then(startSession),
      updateUser: setUser,
      logout,
    }),
    [user, restoring, startSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
