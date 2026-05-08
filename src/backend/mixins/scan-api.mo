import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ScanTypes "../types/scan";
import UsageTypes "../types/usage";
import UserTypes "../types/user";
import ActivityTypes "../types/activity";
import ScanLib "../lib/scan";

mixin (
  accessControlState : AccessControl.AccessControlState,
  scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
  usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
  users : Map.Map<Common.UserId, UserTypes.User>,
  activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
  state : { var nextScanSeq : Nat },
) {
  /// Create a new scan; enforces free-tier daily limit
  public shared ({ caller }) func createScan(args : ScanTypes.CreateScanArgs) : async ScanTypes.ScanView {
    ScanLib.create(scans, usageLimits, users, caller, args, state);
  };

  /// Update an existing scan owned by caller
  public shared ({ caller }) func updateScan(args : ScanTypes.UpdateScanArgs) : async ScanTypes.ScanView {
    ScanLib.update(scans, caller, args);
  };

  /// Soft-delete a scan (sets isDeleted = true)
  public shared ({ caller }) func deleteScan(scanId : Common.ScanId) : async () {
    ScanLib.softDelete(scans, caller, scanId);
  };

  /// Restore a soft-deleted scan
  public shared ({ caller }) func restoreScan(scanId : Common.ScanId) : async () {
    ScanLib.restore(scans, caller, scanId);
  };

  /// Get a single scan by id (must be owned by caller)
  public query ({ caller }) func getScan(scanId : Common.ScanId) : async ?ScanTypes.ScanView {
    ScanLib.get(scans, caller, scanId);
  };

  /// List scans with pagination and optional filters
  public query ({ caller }) func listScans(args : ScanTypes.ListScansArgs) : async ScanTypes.ListScansResult {
    ScanLib.list(scans, caller, args);
  };

  /// Full-text search over extractedText for caller's scans
  public query ({ caller }) func searchScans(searchQuery : Text) : async [ScanTypes.ScanView] {
    ScanLib.search(scans, caller, searchQuery);
  };
};
