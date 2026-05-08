import Common "common";

module {
  public type UserPlan = { #free; #premium };

  public type User = {
    id : Common.UserId;
    var plan : UserPlan;
    var scansToday : Int;
    var totalScans : Int;
    var language : Text;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared-safe (no var) view of User for API responses
  public type UserView = {
    id : Common.UserId;
    plan : UserPlan;
    scansToday : Int;
    totalScans : Int;
    language : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type UpdateUserArgs = {
    language : ?Text;
    plan : ?UserPlan;
  };
};
