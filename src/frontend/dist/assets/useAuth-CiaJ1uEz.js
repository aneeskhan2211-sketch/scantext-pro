import { createActor } from "./backend-CPoN6-3F.js";
import { h as create, w as persist, x as useInternetIdentity, r as reactExports } from "./index-BQ7M_1jd.js";
import { u as useActor, a as useQuery } from "./useActor-CMTeB5ul.js";
function useBackendActor() {
  return useActor(createActor);
}
const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, isAuthenticated: false, error: null })
    }),
    {
      name: "scantext-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useBackendActor();
  const {
    user,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout
  } = useAuthStore();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: fetchedUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", identity == null ? void 0 : identity.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrCreateUser();
    },
    enabled: isLoggedIn && !!actor && !isFetching,
    staleTime: 5 * 60 * 1e3
  });
  reactExports.useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
    setLoading(isUserLoading);
  }, [fetchedUser, isUserLoading, setUser, setLoading]);
  reactExports.useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, setLoading]);
  const handleLogin = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      await login();
    } catch {
      setLoading(false);
    }
  }, [login, setLoading]);
  const handleLogout = reactExports.useCallback(() => {
    clear();
    storeLogout();
  }, [clear, storeLogout]);
  return {
    user,
    isAuthenticated: isLoggedIn,
    isLoading: isLoading || loginStatus === "logging-in",
    identity,
    login: handleLogin,
    logout: handleLogout
  };
}
export {
  useAuth as u
};
