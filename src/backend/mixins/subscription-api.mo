import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import SubTypes "../types/subscription";
import UserTypes "../types/user";
import ActivityTypes "../types/activity";
import SubLib "../lib/subscription";

mixin (
  accessControlState : AccessControl.AccessControlState,
  subscriptions : Map.Map<Common.UserId, SubTypes.Subscription>,
  users : Map.Map<Common.UserId, UserTypes.User>,
  activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
  state : { var nextSubSeq : Nat },
) {
  /// Get the caller's active subscription
  public query ({ caller }) func getSubscription() : async ?SubTypes.SubscriptionView {
    SubLib.get(subscriptions, caller);
  };

  /// Create or update the caller's subscription
  public shared ({ caller }) func createOrUpdateSubscription(args : SubTypes.UpsertSubscriptionArgs) : async SubTypes.SubscriptionView {
    SubLib.upsert(subscriptions, users, caller, args, state);
  };
};
