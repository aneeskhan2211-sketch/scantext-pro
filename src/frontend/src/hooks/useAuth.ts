import { useBackendActor } from "@/services/backend";
import { useAuthStore } from "@/stores/authStore";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useBackendActor();
  const {
    user,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout,
  } = useAuthStore();

  const isLoggedIn = loginStatus === "success" && !!identity;

  // Fetch or create user once authenticated
  const { data: fetchedUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrCreateUser();
    },
    enabled: isLoggedIn && !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
    setLoading(isUserLoading);
  }, [fetchedUser, isUserLoading, setUser, setLoading]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, setLoading]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      await login();
    } catch {
      setLoading(false);
    }
  }, [login, setLoading]);

  const handleLogout = useCallback(() => {
    clear();
    storeLogout();
  }, [clear, storeLogout]);

  return {
    user,
    isAuthenticated: isLoggedIn,
    isLoading: isLoading || loginStatus === "logging-in",
    identity,
    login: handleLogin,
    logout: handleLogout,
  };
}
