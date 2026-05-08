import { createActor } from "@/backend";
import type { UsageLimitsView } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const USAGE_KEYS = {
  current: ["usage"] as const,
};

export function useUsageLimit() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UsageLimitsView>({
    queryKey: USAGE_KEYS.current,
    queryFn: async () => {
      if (!actor)
        return {
          scansToday: BigInt(0),
          userId: null,
          canScan: false,
          dailyLimit: BigInt(10),
          lastResetDate: BigInt(0),
        } as unknown as UsageLimitsView;
      return actor.checkUsageLimit();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useIncrementScanCount() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.incrementScanCount();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USAGE_KEYS.current });
    },
  });
}

export function useCanScan(): boolean {
  const { data } = useUsageLimit();
  return data?.canScan ?? true;
}
