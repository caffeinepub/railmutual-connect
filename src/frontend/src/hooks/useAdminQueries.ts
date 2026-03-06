import type { Profile } from "@/backend";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

const ADMIN_EMAIL = "railmutualconnect@gmail.com";

export { ADMIN_EMAIL };

// ─── Admin: check if caller is admin ────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 30_000,
  });
}

// ─── Admin: load all profiles via searchProfiles({}) ────────────────────────

export function useAdminAllProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ["adminAllProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.searchProfiles({});
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 60_000,
  });
}

// ─── Admin: get admin's own matches ─────────────────────────────────────────

export function useAdminMatches() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ["adminMatches"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMatches();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 60_000,
  });
}
