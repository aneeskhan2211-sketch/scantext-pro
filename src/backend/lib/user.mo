import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import UserTypes "../types/user";
import ScanTypes "../types/scan";
import FolderTypes "../types/folder";
import SubTypes "../types/subscription";
import UsageTypes "../types/usage";
import ActivityTypes "../types/activity";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {
  public func getOrCreate(
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Principal,
  ) : UserTypes.User {
    switch (users.get(caller)) {
      case (?u) u;
      case null {
        let now = Time.now();
        let user : UserTypes.User = {
          id = caller;
          var plan = #free;
          var scansToday = 0;
          var totalScans = 0;
          var language = "en";
          createdAt = now;
          var updatedAt = now;
        };
        users.add(caller, user);
        user;
      };
    };
  };

  public func update(
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Principal,
    args : UserTypes.UpdateUserArgs,
  ) : UserTypes.UserView {
    let user = getOrCreate(users, caller);
    switch (args.language) {
      case (?lang) { user.language := lang };
      case null {};
    };
    switch (args.plan) {
      case (?p) { user.plan := p };
      case null {};
    };
    user.updatedAt := Time.now();
    toView(user);
  };

  public func deleteAccount(
    users : Map.Map<Common.UserId, UserTypes.User>,
    scans : Map.Map<Common.ScanId, ScanTypes.Scan>,
    folders : Map.Map<Common.FolderId, FolderTypes.Folder>,
    subscriptions : Map.Map<Common.UserId, SubTypes.Subscription>,
    usageLimits : Map.Map<Common.UserId, UsageTypes.UsageLimits>,
    activities : Map.Map<Common.ActivityId, ActivityTypes.Activity>,
    caller : Principal,
  ) : () {
    // Collect and remove all scans owned by caller
    var scanIds : [Common.ScanId] = [];
    for ((id, scan) in scans.entries()) {
      if (Principal.equal(scan.userId, caller)) {
        scanIds := scanIds.concat([id]);
      };
    };
    for (id in scanIds.values()) { scans.remove(id) };
    // Collect and remove all folders owned by caller
    var folderIds : [Common.FolderId] = [];
    for ((id, folder) in folders.entries()) {
      if (Principal.equal(folder.userId, caller)) {
        folderIds := folderIds.concat([id]);
      };
    };
    for (id in folderIds.values()) { folders.remove(id) };
    // Remove caller's subscription and usage limits
    subscriptions.remove(caller);
    usageLimits.remove(caller);
    // Collect and remove all activities for caller
    var activityIds : [Common.ActivityId] = [];
    for ((id, activity) in activities.entries()) {
      if (Principal.equal(activity.userId, caller)) {
        activityIds := activityIds.concat([id]);
      };
    };
    for (id in activityIds.values()) { activities.remove(id) };
    // Finally remove the user
    users.remove(caller);
  };

  public func toView(user : UserTypes.User) : UserTypes.UserView {
    {
      id = user.id;
      plan = user.plan;
      scansToday = user.scansToday;
      totalScans = user.totalScans;
      language = user.language;
      createdAt = user.createdAt;
      updatedAt = user.updatedAt;
    };
  };
};
