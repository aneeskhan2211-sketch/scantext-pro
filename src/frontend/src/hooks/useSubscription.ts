import { createActor } from "@/backend";
import type { SubscriptionView, UpsertSubscriptionArgs } from "@/types";
import { UserPlan } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SUB_KEYS = {
  current: ["subscription"] as const,
};

export function useSubscription() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SubscriptionView | null>({
    queryKey: SUB_KEYS.current,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSubscription();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertSubscription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<SubscriptionView, Error, UpsertSubscriptionArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createOrUpdateSubscription(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUB_KEYS.current });
    },
  });
}

/**
 * Returns whether the user has an active premium subscription.
 */
export function useIsPremium(): boolean {
  const { data: sub } = useSubscription();
  if (!sub) return false;
  if (sub.plan === UserPlan.premium) {
    if (sub.currentPeriodEnd) {
      return Number(sub.currentPeriodEnd) > Date.now() / 1000;
    }
    return true;
  }
  return false;
}

/**
 * Returns a Stripe checkout URL for upgrading.
 * Replace with real Stripe link or redirect.
 */
export function useUpgradeUrl(): string {
  return "/subscription";
}
