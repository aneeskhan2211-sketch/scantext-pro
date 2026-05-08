import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/user";
import ScanTypes "../types/scan";
import FolderTypes "../types/folder";
import SubTypes "../types/subscription";
import UsageTypes "../types/usage";
import ActivityTypes "../types/activity";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Common.UserId, UserTypes.User>,
  scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
  folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
  subscriptions : Map.Map<Common.UserId, SubTypes.Subscription>,
  usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
  activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
) {
  /// Get or create user profile for caller
  public shared ({ caller }) func getOrCreateUser() : async UserTypes.UserView {
    let user = UserLib.getOrCreate(users, caller);
    UserLib.toView(user);
  };

  /// Update caller's user preferences
  public shared ({ caller }) func updateUser(args : UserTypes.UpdateUserArgs) : async UserTypes.UserView {
    UserLib.update(users, caller, args);
  };

  /// Permanently delete caller's account and all associated data
  public shared ({ caller }) func deleteAccount() : async () {
    UserLib.deleteAccount(users, scans, folders, subscriptions, usageLimits, activities, caller);
  };
};
