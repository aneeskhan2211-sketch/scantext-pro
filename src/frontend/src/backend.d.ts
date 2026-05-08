import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface CreateFolderArgs {
    icon: string;
    name: string;
}
export interface SubscriptionView {
    id: SubscriptionId;
    stripeSubscriptionId?: string;
    userId: UserId;
    plan: string;
    currentPeriodEnd?: Timestamp;
}
export interface UserView {
    id: UserId;
    scansToday: bigint;
    createdAt: Timestamp;
    plan: UserPlan;
    language: string;
    totalScans: bigint;
    updatedAt: Timestamp;
}
export interface UsageLimitsView {
    scansToday: bigint;
    userId: UserId;
    canScan: boolean;
    dailyLimit: bigint;
    lastResetDate: Timestamp;
}
export interface UpdateScanArgs {
    id: ScanId;
    tags?: Array<string>;
    isFavorite?: boolean;
    extractedText?: string;
    confidenceScore?: number;
    language?: string;
    exportCount?: bigint;
    folderId?: FolderId;
    isPinned?: boolean;
}
export interface ListScansArgs {
    includeDeleted: boolean;
    offset: bigint;
    limit: bigint;
    folderId?: FolderId;
}
export interface ScanView {
    id: ScanId;
    isDeleted: boolean;
    scanType: ScanType;
    userId: UserId;
    createdAt: Timestamp;
    tags: Array<string>;
    isFavorite: boolean;
    extractedText: string;
    confidenceScore: number;
    language: string;
    updatedAt: Timestamp;
    image: ExternalBlob;
    exportCount: bigint;
    folderId?: FolderId;
    isPinned: boolean;
}
export type UserId = Principal;
export type SubscriptionId = string;
export interface ListScansResult {
    total: bigint;
    scans: Array<ScanView>;
}
export type ScanId = string;
export interface CreateScanArgs {
    scanType: ScanType;
    tags: Array<string>;
    extractedText: string;
    confidenceScore: number;
    language: string;
    image: ExternalBlob;
    folderId?: FolderId;
}
export interface UpsertSubscriptionArgs {
    stripeSubscriptionId?: string;
    plan: string;
    currentPeriodEnd?: Timestamp;
}
export interface FolderView {
    id: FolderId;
    userId: UserId;
    icon: string;
    name: string;
    createdAt: Timestamp;
}
export interface UpdateUserArgs {
    plan?: UserPlan;
    language?: string;
}
export type FolderId = string;
export enum ScanType {
    receipt = "receipt",
    other = "other",
    card = "card",
    document_ = "document"
}
export enum UserPlan {
    premium = "premium",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkUsageLimit(): Promise<UsageLimitsView>;
    createFolder(args: CreateFolderArgs): Promise<FolderView>;
    createOrUpdateSubscription(args: UpsertSubscriptionArgs): Promise<SubscriptionView>;
    createScan(args: CreateScanArgs): Promise<ScanView>;
    deleteAccount(): Promise<void>;
    deleteFolder(folderId: FolderId): Promise<void>;
    deleteScan(scanId: ScanId): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getOrCreateUser(): Promise<UserView>;
    getScan(scanId: ScanId): Promise<ScanView | null>;
    getSubscription(): Promise<SubscriptionView | null>;
    incrementScanCount(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listFolders(): Promise<Array<FolderView>>;
    listScans(args: ListScansArgs): Promise<ListScansResult>;
    resetDailyLimits(): Promise<void>;
    restoreScan(scanId: ScanId): Promise<void>;
    searchScans(searchQuery: string): Promise<Array<ScanView>>;
    updateScan(args: UpdateScanArgs): Promise<ScanView>;
    updateUser(args: UpdateUserArgs): Promise<UserView>;
}
