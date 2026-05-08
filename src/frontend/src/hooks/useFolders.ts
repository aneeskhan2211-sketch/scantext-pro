import { createActor } from "@/backend";
import type { CreateFolderArgs, FolderView } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FOLDER_KEYS = {
  all: ["folders"] as const,
};

export function useListFolders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FolderView[]>({
    queryKey: FOLDER_KEYS.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFolders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateFolder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<FolderView, Error, CreateFolderArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createFolder(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
  });
}

export function useDeleteFolder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteFolder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDER_KEYS.all });
    },
  });
}
