import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UsageTypes "../types/usage";
import UserTypes "../types/user";
import UsageLib "../lib/usage";

mixin (
  accessControlState : AccessControl.AccessControlState,
  usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
  users : Map.Map<Common.UserId, UserTypes.User>,
) {
  /// Check caller's current usage against their plan limit
  public shared ({ caller }) func checkUsageLimit() : async UsageTypes.UsageLimitsView {
    UsageLib.check(usageLimits, users, caller);
  };

  /// Increment caller's scan count (called internally, also exposed for admin use)
  public shared ({ caller }) func incrementScanCount() : async () {
    UsageLib.increment(usageLimits, caller);
  };

  /// Admin: reset daily scan limits for all users (called by admin or scheduler)
  public shared ({ caller }) func resetDailyLimits() : async () {
    UsageLib.resetDaily(usageLimits);
  };
};
