import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import ActivityTypes "../types/activity";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  public func log(
    activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
    state : { var nextActivityId : Nat },
    caller : Principal,
    action : Text,
  ) : () {
    let now = Time.now();
    state.nextActivityId += 1;
    let activityId = "act-" # Int.toText(now) # "-" # Nat.toText(state.nextActivityId);
    let activity : ActivityTypes.Activity = {
      id = activityId;
      userId = caller;
      action;
      timestamp = now;
    };
    activities.add(activityId, activity);
  };
};
