import { createActor } from "./backend-CPoN6-3F.js";
import { l as useQueryClient, r as reactExports } from "./index-BQ7M_1jd.js";
import { u as useActor, a as useQuery } from "./useActor-CMTeB5ul.js";
import { u as useMutation } from "./useMutation-DU8R5-j4.js";
const SCAN_KEYS = {
  all: ["scans"],
  list: (args) => ["scans", "list", args],
  detail: (id) => ["scans", id],
  search: (q) => ["scans", "search", q]
};
function useListScans(args) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: SCAN_KEYS.list(args),
    queryFn: async () => {
      if (!actor) return { scans: [], total: BigInt(0) };
      return actor.listScans(args);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useSearchScans(query) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: SCAN_KEYS.search(query),
    queryFn: async () => {
      if (!actor || !query) return [];
      return actor.searchScans(query);
    },
    enabled: !!query && !!actor && !isFetching,
    staleTime: 1e4
  });
}
function useCreateScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createScan(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    }
  });
}
function useUpdateScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateScan(args);
    },
    onSuccess: (scan) => {
      qc.setQueryData(SCAN_KEYS.detail(scan.id), scan);
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    }
  });
}
function useDeleteScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteScan(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    }
  });
}
function useRestoreScan() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.restoreScan(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCAN_KEYS.all });
    }
  });
}
function useToggleFavorite() {
  const update = useUpdateScan();
  return reactExports.useCallback(
    (id, isFavorite) => update.mutateAsync({ id, isFavorite }),
    [update]
  );
}
export {
  useCreateScan as a,
  useDeleteScan as b,
  useRestoreScan as c,
  useToggleFavorite as d,
  useSearchScans as e,
  useListScans as u
};
