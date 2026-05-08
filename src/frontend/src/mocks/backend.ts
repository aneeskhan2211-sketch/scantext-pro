import type { backendInterface, ExternalBlob, FolderView, ListScansResult, ScanType, ScanView, SubscriptionView, UsageLimitsView, UserPlan, UserRole, UserView } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const fakePrincipal = { toText: () => "user-123", compareTo: () => 0, isAnonymous: () => false } as unknown as Principal;

const fakeBlob = {
  getBytes: async () => new Uint8Array(),
  getDirectURL: () => "https://picsum.photos/seed/scan1/400/300",
  withUploadProgress: function() { return this; },
} as unknown as ExternalBlob;

const fakeFolders: FolderView[] = [
  { id: "folder-1", userId: fakePrincipal, icon: "📄", name: "Study Notes", createdAt: BigInt(Date.now()) },
  { id: "folder-2", userId: fakePrincipal, icon: "🧾", name: "Receipts", createdAt: BigInt(Date.now()) },
  { id: "folder-3", userId: fakePrincipal, icon: "🏢", name: "Office Docs", createdAt: BigInt(Date.now()) },
  { id: "folder-4", userId: fakePrincipal, icon: "🪪", name: "ID Cards", createdAt: BigInt(Date.now()) },
];

const fakeScanType = "document" as unknown as ScanType;

const fakeScans: ScanView[] = [
  {
    id: "scan-1",
    isDeleted: false,
    scanType: fakeScanType,
    userId: fakePrincipal,
    createdAt: BigInt(Date.now() - 3600000),
    tags: ["invoice", "business"],
    isFavorite: true,
    extractedText: "Invoice #INV-2024-001\nDate: May 7, 2026\nTotal Amount: $250.00\nPayment due in 30 days.",
    confidenceScore: 0.97,
    language: "en",
    updatedAt: BigInt(Date.now() - 1800000),
    image: fakeBlob,
    exportCount: BigInt(2),
    folderId: "folder-3",
    isPinned: true,
  },
  {
    id: "scan-2",
    isDeleted: false,
    scanType: "receipt" as unknown as ScanType,
    userId: fakePrincipal,
    createdAt: BigInt(Date.now() - 86400000),
    tags: ["grocery", "expense"],
    isFavorite: false,
    extractedText: "Walmart Superstore\nDate: May 6, 2026\nMilk $3.50\nBread $2.99\nTotal: $12.47",
    confidenceScore: 0.94,
    language: "en",
    updatedAt: BigInt(Date.now() - 86400000),
    image: fakeBlob,
    exportCount: BigInt(0),
    folderId: "folder-2",
    isPinned: false,
  },
  {
    id: "scan-3",
    isDeleted: false,
    scanType: "card" as unknown as ScanType,
    userId: fakePrincipal,
    createdAt: BigInt(Date.now() - 172800000),
    tags: ["contact", "business card"],
    isFavorite: false,
    extractedText: "John Smith\nSenior Developer\nTechCorp Inc.\njohn@techcorp.com\n+1 (555) 123-4567",
    confidenceScore: 0.99,
    language: "en",
    updatedAt: BigInt(Date.now() - 172800000),
    image: fakeBlob,
    exportCount: BigInt(1),
    isPinned: false,
  },
];

const fakeUser: UserView = {
  id: fakePrincipal,
  scansToday: BigInt(3),
  createdAt: BigInt(Date.now() - 7776000000),
  plan: "free" as unknown as UserPlan,
  language: "en",
  totalScans: BigInt(47),
  updatedAt: BigInt(Date.now()),
};

const fakeUsageLimits: UsageLimitsView = {
  scansToday: BigInt(3),
  userId: fakePrincipal,
  canScan: true,
  dailyLimit: BigInt(10),
  lastResetDate: BigInt(Date.now()),
};

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async () => ({ method: "PUT", blob_hash: "abc123" }),
  _immutableObjectStorageRefillCashier: async () => ({ success: true, topped_up_amount: BigInt(0) }),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async () => undefined,
  checkUsageLimit: async () => fakeUsageLimits,
  createFolder: async (args) => ({ id: "new-folder", userId: fakePrincipal, icon: args.icon, name: args.name, createdAt: BigInt(Date.now()) }),
  createOrUpdateSubscription: async (args) => ({
    id: "sub-1",
    userId: fakePrincipal,
    plan: args.plan,
    stripeSubscriptionId: args.stripeSubscriptionId,
    currentPeriodEnd: args.currentPeriodEnd,
  }),
  createScan: async (args) => ({
    id: "new-scan",
    isDeleted: false,
    scanType: args.scanType,
    userId: fakePrincipal,
    createdAt: BigInt(Date.now()),
    tags: args.tags,
    isFavorite: false,
    extractedText: args.extractedText,
    confidenceScore: args.confidenceScore,
    language: args.language,
    updatedAt: BigInt(Date.now()),
    image: args.image,
    exportCount: BigInt(0),
    folderId: args.folderId,
    isPinned: false,
  }),
  deleteAccount: async () => undefined,
  deleteFolder: async () => undefined,
  deleteScan: async () => undefined,
  getCallerUserRole: async () => "user" as unknown as UserRole,
  getOrCreateUser: async () => fakeUser,
  getScan: async (id) => fakeScans.find((s) => s.id === id) ?? null,
  getSubscription: async () => null,
  incrementScanCount: async () => undefined,
  isCallerAdmin: async () => false,
  listFolders: async () => fakeFolders,
  listScans: async (): Promise<ListScansResult> => ({
    total: BigInt(fakeScans.length),
    scans: fakeScans,
  }),
  resetDailyLimits: async () => undefined,
  restoreScan: async () => undefined,
  searchScans: async (query) => fakeScans.filter((s) => s.extractedText.toLowerCase().includes(query.toLowerCase())),
  updateScan: async (args) => {
    const scan = fakeScans.find((s) => s.id === args.id);
    if (!scan) throw new Error("Scan not found");
    return { ...scan, ...args, updatedAt: BigInt(Date.now()) };
  },
  updateUser: async (args) => ({ ...fakeUser, ...args }),
};
