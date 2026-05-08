import Common "common";

module {
  public let FREE_DAILY_SCAN_LIMIT : Int = 10;

  public type UsageLimits = {
    userId : Common.UserId;
    var scansToday : Int;
    var lastResetDate : Common.Timestamp;
  };

  public type UsageLimitsView = {
    userId : Common.UserId;
    scansToday : Int;
    lastResetDate : Common.Timestamp;
    dailyLimit : Int;
    canScan : Bool;
  };
};
