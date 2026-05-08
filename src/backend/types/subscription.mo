import Common "common";

module {
  public type Subscription = {
    id : Common.SubscriptionId;
    userId : Common.UserId;
    var plan : Text;
    var stripeSubscriptionId : ?Text;
    var currentPeriodEnd : ?Common.Timestamp;
  };

  public type SubscriptionView = {
    id : Common.SubscriptionId;
    userId : Common.UserId;
    plan : Text;
    stripeSubscriptionId : ?Text;
    currentPeriodEnd : ?Common.Timestamp;
  };

  public type UpsertSubscriptionArgs = {
    plan : Text;
    stripeSubscriptionId : ?Text;
    currentPeriodEnd : ?Common.Timestamp;
  };
};
