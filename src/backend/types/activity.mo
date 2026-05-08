import Common "common";

module {
  public type Activity = {
    id : Common.ActivityId;
    userId : Common.UserId;
    action : Text;
    timestamp : Common.Timestamp;
  };
};
