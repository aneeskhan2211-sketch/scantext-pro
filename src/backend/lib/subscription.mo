import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import SubTypes "../types/subscription";
import UserTypes "../types/user";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  public func get(
    subscriptions : Map.Map<Common.UserId, SubTypes.Subscription>,
    caller : Principal,
  ) : ?SubTypes.SubscriptionView {
    switch (subscriptions.get(caller)) {
      case (?sub) ?toView(sub);
      case null null;
    };
  };

  public func upsert(
    subscriptions : Map.Map<Common.UserId, SubTypes.Subscription>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Principal,
    args : SubTypes.UpsertSubscriptionArgs,
    seqState : { var nextSubSeq : Nat },
  ) : SubTypes.SubscriptionView {
    let sub = switch (subscriptions.get(caller)) {
      case (?existing) {
        existing.plan := args.plan;
        existing.stripeSubscriptionId := args.stripeSubscriptionId;
        existing.currentPeriodEnd := args.currentPeriodEnd;
        existing;
      };
      case null {
        seqState.nextSubSeq += 1;
        let subId = "sub-" # Time.now().toText() # "-" # seqState.nextSubSeq.toText();
        let newSub : SubTypes.Subscription = {
          id = subId;
          userId = caller;
          var plan = args.plan;
          var stripeSubscriptionId = args.stripeSubscriptionId;
          var currentPeriodEnd = args.currentPeriodEnd;
        };
        subscriptions.add(caller, newSub);
        newSub;
      };
    };
    // Sync user plan when premium subscription is applied
    if (args.plan == "premium") {
      switch (users.get(caller)) {
        case (?u) { u.plan := #premium };
        case null {};
      };
    } else if (args.plan == "free") {
      switch (users.get(caller)) {
        case (?u) { u.plan := #free };
        case null {};
      };
    };
    toView(sub);
  };

  public func toView(sub : SubTypes.Subscription) : SubTypes.SubscriptionView {
    {
      id = sub.id;
      userId = sub.userId;
      plan = sub.plan;
      stripeSubscriptionId = sub.stripeSubscriptionId;
      currentPeriodEnd = sub.currentPeriodEnd;
    };
  };
};
