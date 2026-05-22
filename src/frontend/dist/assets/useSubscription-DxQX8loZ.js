import { UserPlan, createActor } from "./backend-CPoN6-3F.js";
import "./index-BQ7M_1jd.js";
import { u as useActor, a as useQuery } from "./useActor-CMTeB5ul.js";
const SUB_KEYS = {
  current: ["subscription"]
};
function useSubscription() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: SUB_KEYS.current,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSubscription();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1e3
  });
}
function useIsPremium() {
  const { data: sub } = useSubscription();
  if (!sub) return false;
  if (sub.plan === UserPlan.premium) {
    if (sub.currentPeriodEnd) {
      return Number(sub.currentPeriodEnd) > Date.now() / 1e3;
    }
    return true;
  }
  return false;
}
export {
  useSubscription as a,
  useIsPremium as u
};
