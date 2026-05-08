import { createActor } from "@/backend";
import type {
  CreateScanArgs,
  ListScansArgs,
  ListScansResult,
  ScanView,
  UpdateScanArgs,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const SCAN_KEYS = {
  all: ["scans"] as const,
  list: (args: ListScansArgs) => ["scans", "list", args] as const,
  detail: (id: string) => ["scans", id] as const,
  search: (q: string) => ["scans", "search", q] as const,
};

export function useListScans(args: ListScansArgs) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ListScansResult>({
    queryKey: SCAN_KEYS.list(args),
    queryFn: async () => {
      if (!actor) return { scans: [], total: BigInt(0) };
      return actor.listScans(args);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetScan(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ScanView | null>({
    queryKey: SCAN_KEYS.detail(id),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getScan(id);
    },
    enabled: !!id && !!actor && !isFetching,
  });
}

export function useSearchScans(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ScanView[]>({
    queryKey: SCAN_KEYS.search(query),
    queryFn: async () => {
      if (!actor || !query) return [];
      return actor.searchScans(query);
    },
    enabled: !!query && !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useCreateScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<ScanView, Error, CreateScanArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createScan(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    },
  });
}

export function useUpdateScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<ScanView, Error, UpdateScanArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateScan(args);
    },
    onSuccess: (scan) => {
      qc.setQueryData(SCAN_KEYS.detail(scan.id), scan);
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    },
  });
}

export function useDeleteScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteScan(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    },
  });
}

export function useRestoreScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.restoreScan(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    },
  });
}

export function useToggleFavorite() {
  const update = useUpdateScan();
  return useCallback(
    (id: string, isFavorite: boolean) => update.mutateAsync({ id, isFavorite }),
    [update],
  );
}

export function useTogglePinned() {
  const update = useUpdateScan();
  return useCallback(
    (id: string, isPinned: boolean) => update.mutateAsync({ id, isPinned }),
    [update],
  );
}
