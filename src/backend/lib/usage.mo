import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import UsageTypes "../types/usage";
import UserTypes "../types/user";

module {
  // Number of nanoseconds in one day
  let DAY_NS : Int = 86_400_000_000_000;

  func dayOf(ts : Int) : Int = ts / DAY_NS;

  func getOrInit(
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
    caller : Principal,
  ) : UsageTypes.UsageLimits {
    switch (usageLimits.get(caller)) {
      case (?u) {
        // Reset if a new day has started (UTC)
        let now = Time.now();
        if (dayOf(now) > dayOf(u.lastResetDate)) {
          u.scansToday := 0;
          u.lastResetDate := now;
        };
        u;
      };
      case null {
        let u : UsageTypes.UsageLimits = {
          userId = caller;
          var scansToday = 0;
          var lastResetDate = Time.now();
        };
        usageLimits.add(caller, u);
        u;
      };
    };
  };

  public func check(
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Principal,
  ) : UsageTypes.UsageLimitsView {
    let usage = getOrInit(usageLimits, caller);
    let isPremium = switch (users.get(caller)) {
      case (?u) u.plan == #premium;
      case null false;
    };
    let canScan = isPremium or usage.scansToday < UsageTypes.FREE_DAILY_SCAN_LIMIT;
    {
      userId = caller;
      scansToday = usage.scansToday;
      lastResetDate = usage.lastResetDate;
      dailyLimit = UsageTypes.FREE_DAILY_SCAN_LIMIT;
      canScan;
    };
  };

  public func increment(
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
    caller : Principal,
  ) : () {
    let usage = getOrInit(usageLimits, caller);
    usage.scansToday += 1;
  };

  public func resetDaily(
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
  ) : () {
    let now = Time.now();
    for ((_, u) in usageLimits.entries()) {
      if (dayOf(now) > dayOf(u.lastResetDate)) {
        u.scansToday := 0;
        u.lastResetDate := now;
      };
    };
  };
};
