/**
 * Backend service layer — typed wrappers around the canister actor.
 * Import and call these from hooks/useScans.ts, hooks/useFolders.ts, etc.
 * Do NOT import raw actor methods in components.
 */
import { createActor } from "@/backend";
import type {
  UserView,
  ScanView,
  FolderView,
  SubscriptionView,
  UsageLimitsView,
  CreateScanArgs,
  UpdateScanArgs,
  ListScansArgs,
  ListScansResult,
  CreateFolderArgs,
  UpsertSubscriptionArgs,
  UpdateUserArgs,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";

// Re-export createActor so hooks can pass it to useActor
export { createActor };

// ─── Actor accessor hook (thin wrapper) ─────────────────────────────────────
export function useBackendActor() {
  return useActor(createActor);
}

// ─── Service class (used by hooks via actor instance) ───────────────────────
export class BackendService {
  // biome-ignore lint/suspicious/noExplicitAny: actor type from binding generator
  constructor(private actor: any) {}

  // User
  async getOrCreateUser(): Promise<UserView> {
    return this.actor.getOrCreateUser();
  }

  async updateUser(args: UpdateUserArgs): Promise<UserView> {
    return this.actor.updateUser(args);
  }

  async deleteAccount(): Promise<void> {
    return this.actor.deleteAccount();
  }

  // Scans
  async createScan(args: CreateScanArgs): Promise<ScanView> {
    return this.actor.createScan(args);
  }

  async updateScan(args: UpdateScanArgs): Promise<ScanView> {
    return this.actor.updateScan(args);
  }

  async deleteScan(id: string): Promise<void> {
    return this.actor.deleteScan(id);
  }

  async restoreScan(id: string): Promise<void> {
    return this.actor.restoreScan(id);
  }

  async getScan(id: string): Promise<ScanView | null> {
    return this.actor.getScan(id);
  }

  async listScans(args: ListScansArgs): Promise<ListScansResult> {
    return this.actor.listScans(args);
  }

  async searchScans(query: string): Promise<ScanView[]> {
    return this.actor.searchScans(query);
  }

  // Folders
  async createFolder(args: CreateFolderArgs): Promise<FolderView> {
    return this.actor.createFolder(args);
  }

  async listFolders(): Promise<FolderView[]> {
    return this.actor.listFolders();
  }

  async deleteFolder(id: string): Promise<void> {
    return this.actor.deleteFolder(id);
  }

  // Subscription
  async getSubscription(): Promise<SubscriptionView | null> {
    return this.actor.getSubscription();
  }

  async upsertSubscription(
    args: UpsertSubscriptionArgs,
  ): Promise<SubscriptionView> {
    return this.actor.createOrUpdateSubscription(args);
  }

  // Usage
  async checkUsageLimit(): Promise<UsageLimitsView> {
    return this.actor.checkUsageLimit();
  }

  async incrementScanCount(): Promise<void> {
    return this.actor.incrementScanCount();
  }
}
