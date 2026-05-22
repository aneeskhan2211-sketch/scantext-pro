import { createActor } from "./backend-CPoN6-3F.js";
import "./index-BQ7M_1jd.js";
import { u as useActor, a as useQuery } from "./useActor-CMTeB5ul.js";
const USAGE_KEYS = {
  current: ["usage"]
};
function useUsageLimit() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: USAGE_KEYS.current,
    queryFn: async () => {
      if (!actor)
        return {
          scansToday: BigInt(0),
          userId: null,
          canScan: false,
          dailyLimit: BigInt(10),
          lastResetDate: BigInt(0)
        };
      return actor.checkUsageLimit();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCanScan() {
  const { data } = useUsageLimit();
  return (data == null ? void 0 : data.canScan) ?? true;
}
export {
  useCanScan as a,
  useUsageLimit as u
};
